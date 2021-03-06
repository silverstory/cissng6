const secrets = require("./secrets.js");
module.exports = {
    DB_HOST: secrets.get("DB_HOST") || process.env.DB_HOST,
    DB_NAME: secrets.get("DB_NAME") || process.env.DB_NAME,
    DB_USER_NAME: secrets.get("DB_USER_NAME") || process.env.DB_USER_NAME,
    DB_PASSWORD: secrets.get("DB_PASSWORD") || process.env.DB_PASSWORD,
    JWT_SECRET: secrets.get("JWT_SECRET") || process.env.JWT_SECRET,
    DB_MODE: secrets.get("DB_MODE") || process.env.DB_MODE,
    TWILIO_ACCOUNT_SID: secrets.get("TWILIO_ACCOUNT_SID") || process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: secrets.get("TWILIO_AUTH_TOKEN") || process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER: secrets.get("TWILIO_FROM_NUMBER") || process.env.TWILIO_FROM_NUMBER
};