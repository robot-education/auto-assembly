import { config } from "dotenv";
config();

/**
 * The port this application should run on. This may be `undefined`.
 */
export const port = process.env.PORT;

/**
 * The parent URL of the Onshape API endpoints, e.g. `https://cad.onshape.com/api`.
 */
export const onshapeApiUrl = process.env.API_URL;

/**
 * The absolute URL of the OAuth callback URL. This will be the `/oauthRedirect` endpoint
 * on this server, e.g. `https://your-machine.example.com/oauthRedirect`.
 */
export const oauthCallbackUrl = process.env.OAUTH_CALLBACK_URL;

/**
 * The Client ID of this application as registered in the Onshape Dev Portal.
 */
export const oauthClientId = process.env.OAUTH_CLIENT_ID;

/**
 * The Client Secret of this application as registered in the Onshape Dev Portal.
 */
export const oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;

/**
 * The parent URL of the Onshape OAuth endpoints, e.g. `https://oauth.onshape.com`.
 */
export const oauthUrl = process.env.OAUTH_URL;

/**
 * The secret for handling session data.
 */
export const sessionSecret = process.env.SESSION_SECRET;

/**
 * The URL of the webhook callback URL. This will be the `/api/event` endpoint on
 * this server, e.g. `https://your-machine.example.com`.
 */
export const webhookCallbackRootUrl = process.env.WEBHOOK_CALLBACK_ROOT_URL;

/**
 * Checks if the given string is a URL. A string considered a URL if it can be parsed
 * as a URL (based on the WHATWG definition).
 * If `protocols` is provided, this will be taken into account in the validation.
 * 
 * For example:
 * 
 * `isValidUrl("https://example.com", [ "http:", "https:" ])` would evaluate to `true`
 * 
 * `isValidUrl("http://sub.example.com", [ "redis:" ])` would evaluate to `false`
 * 
 * `isValidUrl("example.com")` would evaluate to `false`
 * 
 * @param {string} stringToTest The string to check for validity.
 * @param {string|string[]} protocols The protocol(s) to include in the validity
 *      check. May be excluded, in which case it will not be considered in the check.
 * 
 * @returns {boolean} `true` if the given string is a valid URL, and has one of the
 *      given protocols (if provided); or `false` otherwise.
 */
function isValidUrl(stringToTest: string | undefined, protocols: string[] | string): boolean {
    if (!stringToTest) {
        return false;
    }

    try {
        const url = new URL(stringToTest);
        if (!protocols) {
            return true;
        }
        if (typeof protocols == "string") {
            protocols = [protocols];
        }
        return !protocols || protocols.includes(url.protocol);
    } catch {
        return false;
    }
}

/**
 * Checks if the given string is an HTTP or HTTPS URL. A string is considered if it can
 * be parsed as a URL (based on the WHATWG definition).
 * 
 * For example:
 * 
 * `isValidHttpUrl("http://example.com")` would evaluate to `true`
 * 
 * `isValidHttpUrl("ftp://user:pass@ftp.example.com/public/doc.txt)` would evaluate
 * to `false`
 * 
 * `isValidHttpUrl("example.com")` would evaluate to `false`
 * 
 * @param {string} stringToTest The string to check for validity.
 */
function isValidHttpUrl(stringToTest?: string): boolean {
    return isValidUrl(stringToTest, ["http:", "https:"]);
}

/**
 * Checks if the given string has content, i.e. is not null and does not contain solely
 * whitespace characters.
 * 
 * @param {string} stringToTest The string to check for validity.
 */
function isValidString(stringToTest?: string): boolean {
    if (!stringToTest) return false;
    if (!(stringToTest.trim())) return false;
    return true;
}

// We will check the entire configuration and only throw one error (if invalid).
const errors: string[] = [];

if (port && !isValidString(port)) errors.push("PORT must have content");
if (!isValidHttpUrl(onshapeApiUrl)) errors.push("API_URL is not a valid HTTP(S) URL");
if (!isValidHttpUrl(oauthCallbackUrl)) errors.push("OAUTH_CALLBACK_URL is not a valid HTTP(S) URL");
if (!isValidString(oauthClientId)) errors.push("OAUTH_CLIENT_ID must have content");
if (!isValidString(oauthClientSecret)) errors.push("OAUTH_CLIENT_SECRET must have content");
if (!isValidHttpUrl(oauthUrl)) errors.push("OAUTH_URL is not a valid HTTP(S) URL");
if (!isValidString(sessionSecret)) errors.push("SESSION_SECRET must have content");
if (!isValidHttpUrl(webhookCallbackRootUrl)) errors.push("WEBHOOK_CALLBACK_ROOT_URL is not a valid HTTP(S) URL");

// Halt execution if the app isn"t correctly configured.
if (errors.length !== 0) {
    throw new Error("Invalid configuration: " + errors.join(", "));
}