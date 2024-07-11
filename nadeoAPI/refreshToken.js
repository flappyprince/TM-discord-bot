const axios = require('axios');
const fs = require('fs');
const path = require('node:path');

jsonPath = path.join(__dirname,'tokens.json');

try {
        jsonData = fs.readFileSync(jsonPath, 'utf8');
    } catch (error) {
        console.error(error);
}
const tokens = JSON.parse(jsonData);

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://prod.trackmania.core.nadeo.online/v2/authentication/token/refresh',
  headers: { 
    'Authorization': `nadeo_v1 t=${tokens.refreshToken}`
  }
};

async function refreshNadeoToken() {
    try {
        const response = await axios.request(config);
        console.log("refreshed nadeo api tokens");
        console.log(JSON.stringify(response.data));
        let tokens =  response.data
        tokens.accessExpiry = JSON.stringify(Date.now())
         fs.writeFileSync(jsonPath, JSON.stringify(tokens))
    } catch(error) {
        console.error(error);
    }
}

module.exports = {refreshNadeoToken}