const fs = require('fs');
const path = require('node:path');

jsonFilePath = path.join(__dirname,'tokens.json');

try {
        jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    } catch (error) {
        console.error(error);
}

const tokens = JSON.parse(jsonData);
console.log(tokens.accessToken)
