const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_ACCOUNTS_ID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = client;
