const { google } = require("googleapis");

const apiGoogle = async () => {
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "";
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || "";
    const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "";
    console.log(refreshToken, clientId, clientSecret, redirectUri);
    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
    );

    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await oauth2Client.getAccessToken();
    return accessToken;
};

const clientId = process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const redirectUri = process.env.GOOGLE_REDIRECT_URI || "";
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || "";
console.log(refreshToken, clientId, clientSecret, redirectUri);

module.exports = {
    apiGoogle,
};