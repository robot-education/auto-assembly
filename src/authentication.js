let request = require('request-promise');
let passport = require('passport');
let OnshapeStrategy = require('passport-onshape').Strategy;
require('dotenv').config();

// let oauthClientId;
// let oauthClientSecret;
// let oauthUrl;
// let apiUrl;
// let callbackUrl;

if (process.env.OAUTH_CLIENT_ID) {
    oauthClientId = process.env.OAUTH_CLIENT_ID;
}
else {
    throw new Error("OAUTH_CLIENT_ID not set");
}
if (process.env.OAUTH_CLIENT_SECRET) {
    oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;
}
else {
    throw new Error("OAUTH_CLIENT_SECRET not set");
}
if (process.env.OAUTH_URL) {
    oauthUrl = process.env.OAUTH_URL;
}
else {
    throw new Error("OAUTH_URL not set");
}
if (process.env.API_URL) {
    apiUrl = process.env.API_URL;
}
else {
    throw new Error("API_URL not set");
}
if (process.env.OAUTH_CALLBACK_URL) {
    callbackUrl = process.env.OAUTH_CALLBACK_URL;
}
else {
    throw new Error("OAUTH_CALLBACK_URL not set");
}

function init() {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    passport.use(new OnshapeStrategy({
        clientID: oauthClientId,
        clientSecret: oauthClientSecret,
        // Replace the callbackURL string with your own deployed servers path to handle the OAuth redirect
        callbackURL: callbackUrl,
        authorizationURL: oauthUrl + "/oauth/authorize",
        tokenURL: oauthUrl + "/oauth/token",
        userProfileURL: apiUrl + "/api/users/sessioninfo"
    },
        (accessToken, refreshToken, profile, done) => {
            // asynchronous verification, for effect...
            process.nextTick(() => {
                profile.accessToken = accessToken;
                profile.refreshToken = refreshToken;

                // To keep the example simple, the user's Onshape profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Onshape account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));
}

function onOAuthTokenReceived(body, req) {
    let jsonResponse;
    jsonResponse = JSON.parse(body);
    if (jsonResponse) {
        req.user.accessToken = jsonResponse.access_token;
        req.user.refreshToken = jsonResponse.refresh_token;
    }
}

let pendingTokenRefreshes = {};
function refreshOAuthToken(req, res, _) {
    if (pendingTokenRefreshes[req.session.id]) {
        return pendingTokenRefreshes[req.session.id]
    }

    let refreshToken = req.user.refreshToken;

    if (refreshToken) {
        pendingTokenRefreshes[req.session.id] = request.post({
            uri: oauthUrl + '/oauth/token',
            form: {
                'client_id': oauthClientId,
                'client_secret': oauthClientSecret,
                'grant_type': 'refresh_token',
                'refresh_token': refreshToken
            }
        }).then((body) => {
            delete pendingTokenRefreshes[req.session.id];
            return onOAuthTokenReceived(body, req);
        }).catch((error) => {
            delete pendingTokenRefreshes[req.session.id];
            console.log('Error refreshing OAuth Token: ', error);
            res.status(401).send({
                authUri: getAuthUri(),
                msg: 'Authentication required.'
            });
            throw (error);
        });
        return pendingTokenRefreshes[req.session.id];
    } else {
        return Promise.reject('No refresh_token');
    }
}

function getAuthUri() {
    return oauthUrl + '/oauth/authorize?response_type=code&client_id=' + oauthClientId;
}

module.exports = {
    'init': init,
    'refreshOAuthToken': refreshOAuthToken,
    'getAuthUri': getAuthUri
};