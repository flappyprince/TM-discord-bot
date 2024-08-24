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

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});

console.log(config)