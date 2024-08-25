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
  try {
    const response = await axios.request(config);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  return response.data.ticket;
}

module.exports = {requestUbiTicket}