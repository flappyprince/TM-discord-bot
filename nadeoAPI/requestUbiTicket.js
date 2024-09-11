require('dotenv').config({path : '../.env'});
const axios = require('axios');

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://public-ubiservices.ubi.com/v3/profiles/sessions',
  headers: { 
    'Content-Type': 'application/json', 
    'Ubi-AppId': `${process.env.APP_ID}`, 
    'Authorization': `${process.env.AUTH_TOKEN}`
  }
};

async function requestUbiTicket() {
  let response;
  let retries = 0;
  while(retries < 5) {
    try {
      response = await axios.request(config);
      break;
  } catch (error) {
      console.error(error);
      retries++;
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
    return response.data.ticket
  }
}

module.exports = {requestUbiTicket}