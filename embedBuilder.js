const { EmbedBuilder } = require("discord.js");
const fs = require('fs');

function emojiMedal(medal) {
	let emojiString = "";
	switch(medal) {
		case 0: // no medal
			// U+2005 is a midspace, this combination
			// seems to be about equal to the space of a medal emoji
			emojiString = '\u2005' + invisibleWhitespaces(2);
			break;
		case 1:
			emojiString = "<:bronze:1259375720749203476>";
			break;
		case 2:
			emojiString = "<:silver:1259375724842844220>";
			break;
		case 3:
			emojiString = "<:gold:1259375723454664724>";
			break;
		case 4:
			emojiString = "<:author:1259375722019950654>";
			break;
	}
	return emojiString;
}

function longestNamelength(leaderboard) {
	let longestNamelength = 0
	leaderboard.forEach(e => {
		if (e.name.length > longestNamelength) {
			longestNamelength = e.name.length;
		}
	});
	return longestNamelength;
}
function msToTime(timeMs) {
  let ms = timeMs % 1000;
  timeMs = (timeMs - ms) / 1000;
  let secs = timeMs % 60;
  timeMs = (timeMs - secs) / 60;
  let mins = timeMs % 60;
  
  // add leading zeros
  if(mins < 10) mins = '0' + mins;
  if(secs < 10) secs = '0' + secs;
  if(ms < 100) {
	ms = '0' + ms;
	if(ms < 10) ms = '0' + ms;
  }
  return  mins + ':' + secs + '.' + ms; 
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function leaderBoardString(leaderboard) {
	let leaderboardString = ""
	const maxNamelength = longestNamelength(leaderboard);
	leaderboard.forEach(record => {
		leaderboardString += (emojiMedal(record.medal) + invisibleWhitespaces(2));
		leaderboardString += (msToTime(record.time) + invisibleWhitespaces(4));
		leaderboardString += (capitalizeFirstLetter(record.name));
		leaderboardString += '\r\n';
	});
	return leaderboardString;
}

function invisibleWhitespaces(n) {
	let whitespaceStr = ''
	for (let index = 0; index < n; index++) {
		whitespaceStr += '\u2000';
	}
	return whitespaceStr;
}

function getMapThumbnailUrl(map) {
	const jsonCampaignData = fs.readFileSync('./trackmania campaign S24.json', 'utf-8');
	const campaignMaps =  JSON.parse(jsonCampaignData);
	const index = parseInt(map) - 1
	return campaignMaps[index].thumbnailUrl;
}

function getMapName(map) {
	const jsonCampaignData = fs.readFileSync('./trackmania campaign S24.json', 'utf-8');
	const campaignMaps =  JSON.parse(jsonCampaignData);
	const index = parseInt(map) - 1
	return campaignMaps[index].name;
}

function leaderBoardEmbed(leaderboard, map) {
    const mapThumbnailUrl = getMapThumbnailUrl(map);
    const mapName = getMapName(map);
    const embed = new EmbedBuilder()
        .setThumbnail(mapThumbnailUrl)
        .setTitle(mapName);

	// if the response is an empty array
    if (leaderboard.length === 0) {
        embed.addFields({ name: 'Error', value: 'No records\nSmh you need to do more gaming' });
		embed.setColor(0xff0000) // error red
    } else {
        const table = leaderBoardString(leaderboard);
		// the u1CBC show up as a box on mobile devices, but i have yet to find another character that isn't just 
		// stripped at the start of a field, which makes the title not line up with the fields
        const title = '\u1CBC' + '\u1CBC' + '\u1CBC' + '\u1CBC' + `Time${invisibleWhitespaces(8)}User`;
        embed.addFields({ name: title, value: table });
		embed.setColor(0xff990a) // orange
    }

    return embed;
}

module.exports = {leaderBoardEmbed}