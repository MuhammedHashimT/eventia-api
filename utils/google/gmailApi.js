const { google } = require("googleapis");

const apiGoogle = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || "";
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || "";

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
    );
    return oauth2Client;
};

module.exports = {
    apiGoogle,
};