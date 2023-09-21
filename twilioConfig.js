// twilioConfig.js
const twilio = require("twilio");

const client = new twilio(process.env.ACCOUNTS_ID, process.env.AUTH_TOKEN);

module.exports = client;
