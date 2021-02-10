"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
/**
 * Sends a message to the parent window
 * @param {IMessage} message - Message object
 */
function postAppMessage(message) {
    window.top.postMessage(message, "*");
}
exports.postAppMessage = postAppMessage;
/**
 * Stores the token on the window object
 * @param {string} token - App token
 * @param {boolean} dev - sets the correct URL to use
 */
function initDevKit(token, dev) {
    if (window) {
        window.WEEKDAY_DEVKIT_TOKEN = token;
        window.API_URL = dev ? constants_1.API_DEVELOPMENT : constants_1.API_PRODUCTION;
        return true;
    }
    else {
        throw new Error(constants_1.ERRORS.NO_NODEJS);
    }
}
exports.initDevKit = initDevKit;
/**
 * Retreives the userId from the URL
 * This URL will always be available in a sandboxed environment
 */
function getUserId() {
    const url = window.location.href;
    const queryString = url.split("?")[1];
    if (!queryString)
        throw new Error(constants_1.ERRORS.NO_USER_ID);
    const parameters = queryString.split("&");
    let userIdParameterValue = "";
    // Iterate over the parameter to find the userId
    // If we find it, then we save above
    parameters.filter(parameter => {
        const parameterParts = parameter.split("=");
        const key = parameterParts[0];
        const value = parameterParts[1];
        // We found it
        if (key == "userId")
            userIdParameterValue = value;
    });
    // If we couldn't find it, then boohoo
    if (userIdParameterValue == "")
        throw new Error(constants_1.ERRORS.NO_USER_ID);
    // Otherwise return it
    return userIdParameterValue;
}
exports.getUserId = getUserId;
/**
 * Retreives the token on the window object
 */
function getToken() {
    let token = "";
    // If it's a browser
    if (window) {
        if (window.WEEKDAY_DEVKIT_TOKEN === null)
            throw new Error(constants_1.ERRORS.PLEASE_INIT);
        token = window.WEEKDAY_DEVKIT_TOKEN;
    }
    else {
        throw new Error(constants_1.ERRORS.NO_NODEJS);
    }
    return token;
}
exports.getToken = getToken;
/**
 * Polls the document scrollHeight and sends a message to Weekday
 * to adjust the containing iframe
 * @param {string} resizeId - A UUID identifying a single message iframe
 */
function syncMessageHeight(resizeId) {
    setInterval(() => {
        const document = window.document.documentElement;
        const scrollHeight = document.scrollHeight;
        const offsetHeight = document.offsetHeight;
        if (scrollHeight !== offsetHeight) {
            const message = {
                type: "SYNC_MESSAGE_HEIGHT",
                content: {
                    resizeId,
                    resizeHeight: scrollHeight,
                }
            };
            // Send our message to the app
            postAppMessage(message);
        }
    }, 500);
}
exports.syncMessageHeight = syncMessageHeight;
/**
 * Closes an app modal
 * * Don't use a channel token here - it's a simple action
 */
function closeAppModal() {
    const action = {
        type: "modal-close",
        name: "MODAL CLOSE",
        payload: null,
        token: null,
    };
    const message = {
        type: "DISPATCH_APP_ACTION",
        content: { action },
    };
    postAppMessage(message);
}
exports.closeAppModal = closeAppModal;
/**
 * Closes an app panel
 * Don't use a channel token here - it's a simple action
 */
function closeAppPanel() {
    const action = {
        type: "panel-close",
        name: "PANEL CLOSE",
        payload: null,
        token: null,
    };
    const message = {
        type: "DISPATCH_APP_ACTION",
        content: { action },
    };
    postAppMessage(message);
}
exports.closeAppPanel = closeAppPanel;
/**
 * Opens an app panel with an action
 * @param {string} name - Panel title
 * @param {string} url - Panel iframe URL
 * @param {string} token - Channel app token (generated when an app is installed on a channel)
 */
function openAppPanel(name, url, token) {
    const payload = {
        url,
    };
    const action = {
        type: "panel",
        name,
        payload,
        token,
    };
    const message = {
        type: "DISPATCH_APP_ACTION",
        content: { action },
    };
    postAppMessage(message);
}
exports.openAppPanel = openAppPanel;
/**
 * Opens an app modal with an action
 * @param {string} name - Modal title
 * @param {string} url - Modal URL
 * @param {string} height - Modal height, can be % or px
 * @param {string} width - Modal width, can be % or px
 * @param {string} token - Channel app token
 */
function openAppModal(name, url, width, height, token) {
    const payload = {
        url,
        height,
        width,
    };
    const action = {
        type: "modal",
        name,
        payload,
        token,
    };
    const message = {
        type: "DISPATCH_APP_ACTION",
        content: { action },
    };
    postAppMessage(message);
}
exports.openAppModal = openAppModal;
/**
 * Creates a channel message using app channel webhook
 * @param {string} token - temp channel intsall token
 * @param {string} body - text message for the channel message
 * @param {Array.<IAttachment>} attachments - list of attachments to include
 * @param {string} resourceId - string identifying the remote resource
 * @param {string} userId - a userId for the user (passed as a query string parameter)
 */
function createChannelMessage(token, body, attachments, resourceId) {
    return fetch(`${window.API_URL}/app/message`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + token,
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify({ body, attachments, resourceId })
    });
}
exports.createChannelMessage = createChannelMessage;
/**
 * Creates a channel message using app channel webhook
 * @param {string} token - temp channel intsall token
 * @param {string} resourceId - string identifying the remote resource
 */
function deleteChannelMessage(token, resourceId) {
    return fetch(`${window.API_URL}/app/message/${resourceId}`, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + token,
        },
        redirect: "follow",
        referrer: "no-referrer",
    });
}
exports.deleteChannelMessage = deleteChannelMessage;
/**
 * Creates a channel message using app channel webhook
 * @param {string} token - temp channel intsall token
 * @param {string} body - text message for the channel message
 * @param {Array.<IAttachment>} attachments - list of attachments to include
 * @param {string} currentResourceId - old string identifying the remote resource
 * @param {string} resourceId - new string identifying the remote resource
 */
function updateChannelMessage(token, body, attachments, resourceId) {
    return fetch(`${window.API_URL}/app/message/${resourceId}`, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + token,
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify({ body, attachments })
    });
}
exports.updateChannelMessage = updateChannelMessage;
//# sourceMappingURL=index.js.map