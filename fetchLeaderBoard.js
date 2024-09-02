const fs = require('fs');
const axios = require('axios');
const path = require('node:path');
const { refreshNadeoToken } = require('./nadeoAPI/refreshToken');

const tokenPath = path.join('./', 'nadeoAPI/', 'tokens.json');

async function fetchLeaderBoard(map) {

    if(tokenExpired()) {
        await refreshNadeoToken();
    } 

    try {
        const index = parseInt(map) - 1;
        const accessToken = getAccessToken();
        const acccountIDString = getAcccountIDString();
        const mapID = getMapID(index);

        console.log(`map id: ${mapID}`);

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://prod.trackmania.core.nadeo.online/v2/mapRecords/?accountIdList=${acccountIDString}&mapId=${mapID}`,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': `Leaderboard retrival test / ${process.env.UBISOFT_EMAIL}`,
                'Authorization': `nadeo_v1 t=${accessToken}`,
            },
        };

        const response = await axios.request(config);
        const leaderboard = formatLeaderboard(response.data);
        return leaderboard;
    } catch (error) {
        console.log(error);
        return null; // Return null in case of an error to handle it in the caller function
    }
}

function getAccessToken() {
    const jsonTokenData = fs.readFileSync(tokenPath, 'utf-8');
    const tokens = JSON.parse(jsonTokenData);
    return tokens.accessToken;
}

function getAcccountIDString() {
    const jsonPlayerData = fs.readFileSync('./players.json', 'utf-8');
    const players = JSON.parse(jsonPlayerData);
    let acccountIDString = '';
    players.forEach(player => {
        acccountIDString += player.accountID;
        acccountIDString += ',';
    });
    // remove the last comma
    acccountIDString = acccountIDString.slice(0, -1);
    return acccountIDString;
}

function getMapID(index) {
    const jsonCampaignData = fs.readFileSync('./trackmania campaign S24.json', 'utf-8');
    const campaignMaps = JSON.parse(jsonCampaignData);
    return campaignMaps[index].mapId;
}

function getPlayerName(id) {
    let name;
    const jsonPlayerData = fs.readFileSync('./players.json', 'utf-8');
    const players = JSON.parse(jsonPlayerData);
    players.forEach(player => {
        if (player.accountID == id) {
            name = player.name;
        }
    });
    return name;
}

function compareTime(a, b) {
    return a.time - b.time;
}

function formatLeaderboard(records) {
    let leaderboard = [];
    records.forEach(record => {
        let obj = {};
        obj.name = getPlayerName(record.accountId);
        obj.medal = record.medal;
        obj.time = record.recordScore.time;
        leaderboard.push(obj);
    });

    // put fastest time first
    leaderboard.sort(compareTime);

    return leaderboard;
}

function tokenExpired() {
    const tokens = fs.readFileSync(tokenPath, 'utf8');
    const expiryDate = parseInt(JSON.parse(tokens).accessExpiry);

    // if there is 50 minutes since last token refresh, return true
    return (Date.now() > expiryDate + 3000000);
}

module.exports = { fetchLeaderBoard };