const axios = require('axios');
const fs = require('fs').promises;
const path = require('node:path');

jsonPath = path.join(__dirname,'tokens.json');

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://prod.trackmania.core.nadeo.online/v2/authentication/token/refresh',
  headers: { 
    'Authorization': ``
  }
};

async function readRefreshToken() {
  let jsonData;
  try {
      jsonData = await fs.readFile(jsonPath, 'utf8');
    } catch (error) {
        console.error(error);
  }
  return JSON.parse(jsonData).refreshToken;
}

async function refreshNadeoToken() {
  try {
      const refreshToken = await readRefreshToken();
      config.headers.Authorization = `nadeo_v1 t=${refreshToken}`

      const response = await axios.request(config);
      console.log("refreshed nadeo api tokens");
      console.log(JSON.stringify(response.data));

      let tokens =  response.data
      tokens.accessExpiry = JSON.stringify(Date.now())
      await fs.writeFile(jsonPath, JSON.stringify(tokens))
  } catch(error) {
      console.error(error);
  }
}

module.exports = {refreshNadeoToken}