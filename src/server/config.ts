import dotenv from "dotenv";
dotenv.config();

/**
 * The port this application should run on. This may be `undefined`.
 */
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const isProduction = process.env.NODE_ENV === "production";

/**
 * The absolute URL of the OAuth callback URL. This will be the `/oauthRedirect` endpoint
 * on this server, e.g. `https://your-machine.example.com/oauthRedirect`.
 */
const oauthCallbackUrl: string = process.env.OAUTH_CALLBACK_URL ?? "";

/**
 * The Client ID of this application as registered in the Onshape Dev Portal.
 */
const oauthClientId: string = process.env.OAUTH_CLIENT_ID ?? "";

/**
 * The Client Secret of this application as registered in the Onshape Dev Portal.
 */
const oauthClientSecret: string = process.env.OAUTH_CLIENT_SECRET ?? "";

/**
 * The parent URL of the Onshape OAuth endpoints, e.g. `https://oauth.onshape.com`.
 */
const oauthUrl: string = process.env.OAUTH_URL ?? "";

/**
 * The secret for handling session data.
 */
const sessionSecret: string = process.env.SESSION_SECRET ?? "";

const backendUrl: string = process.env.BACKEND_URL ?? "";

/**
 * The URL of the webhook callback URL. This will be the `/api/event` endpoint on
 * this server, e.g. `https://your-machine.example.com`.
 */
// const webhookCallbackRootUrl = process.env.WEBHOOK_CALLBACK_ROOT_URL;

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
function isValidUrl(
    stringToTest: string | undefined,
    protocols: string | string[]
): boolean {
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
function isValidHttpUrl(stringToTest: string | undefined): boolean {
    return isValidUrl(stringToTest, ["http:", "https:"]);
}

/**
 * Checks if the given string has content, i.e. is not null and does not contain solely
 * whitespace characters.
 */
function isValidString(stringToTest: string | undefined): boolean {
    if (!stringToTest) return false;
    if (!stringToTest.trim()) return false;
    return true;
}

// We will check the entire configuration and only throw one error (if invalid).
const errors = [];

// don't check port
if (!isValidHttpUrl(oauthCallbackUrl))
    errors.push("OAUTH_CALLBACK_URL is not a valid HTTP(S) URL");
if (!isValidString(oauthClientId))
    errors.push("OAUTH_CLIENT_ID must have content");
if (!isValidString(oauthClientSecret))
    errors.push("OAUTH_CLIENT_SECRET must have content");
if (!isValidHttpUrl(oauthUrl))
    errors.push("OAUTH_URL is not a valid HTTP(S) URL");
if (!isValidHttpUrl(backendUrl))
    errors.push("BACKEND_URL is not a valid HTTP(S) URL");
if (!isValidString(sessionSecret))
    errors.push("SESSION_SECRET must have content");
// if (!isValidHttpUrl(webhookCallbackRootUrl)) errors.push("WEBHOOK_CALLBACK_ROOT_URL is not a valid HTTP(S) URL");

// Halt execution if the app isn"t correctly configured.
if (errors.length !== 0) {
    throw new Error("Invalid configuration: " + errors.join(", "));
}

const config = {
    port,
    isProduction,
    oauthCallbackUrl,
    oauthClientId,
    oauthClientSecret,
    oauthUrl,
    sessionSecret,
    backendUrl
};
export default config;
