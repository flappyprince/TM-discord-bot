// called every night at 5am, to make a new ticket to call tokens from
// there was an issue that they became invalid after 24 hours,
// and while i am uncertain why this happened, this should solve it

const { requestNadeoToken } = require("./requestToken");
const { requestUbiTicket } = require("./requestUbiTicket");

async function newTicket(client, discordToken) {
    client.destroy(); // log out while getting new tokens
    const ticket = await requestUbiTicket();
    await requestNadeoToken(ticket);
    client.login(discordToken);
}

module.exports = {newTicket}
