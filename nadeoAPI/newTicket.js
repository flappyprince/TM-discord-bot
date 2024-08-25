// called every night at 5am, to make a new ticket to call tokens from
// there was an issue that they became invalid after 24 hours,
// and while i am uncertain why this happened, this should solve it

const { requestNadeoToken } = require("./requestToken");
const { requestUbiTicket } = require("./requestUbiTicket");

const ticket = await requestUbiTicket();
requestNadeoToken(ticket);

