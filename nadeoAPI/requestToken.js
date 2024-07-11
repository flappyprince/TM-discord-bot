require('dotenv').config()

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('node:path');

jsonPath = path.join(__dirname,'tokens.json');
let data = new FormData();

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://prod.trackmania.core.nadeo.online/v2/authentication/token/ubiservices',
  headers: { 
    'Content-Type': 'application/json',
    'User-Agent': `Leaderboard retrival test / ${process.env.UBISOFT_EMAIL}`,
    'Authorization': `ubi_v1 t=${process.env.UBISOFT_TOKEN}`, 
    ...data.getHeaders()
  },
  data : data
};

function requestNadeoToken() {
   axios.request(config)
    .then((response) => {
        console.log('requested tokens for the Nadeo API');
        let tokens =  response.data;
        tokens.accessExpiry = JSON.stringify(Date.now());
        try {
          fs.writeFileSync(jsonPath, JSON.stringify(tokens));  
        } catch (error) {
            console.error(error);
        }

    })
    .catch((error) => {
    console.log(error);
    });
}

module.exports = {requestNadeoToken}