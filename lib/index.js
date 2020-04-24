"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This will be sexier in future
const WEBHOOK_URL_PRODUCTION = "https://api.yack.co/v1/webhook";
const WEBHOOK_URL_DEVELOPMENT = "http://localhost:8181/v1/webhook";
const WEBHOOK_URL = window.YACK_DEV ? WEBHOOK_URL_DEVELOPMENT : WEBHOOK_URL_PRODUCTION;
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
 * @param {String} token - App token
 */
function initDevKit(token, isDev) {
    console.log('DevKit token: ', token);
    if (window) {
        window.YACK_DEVKIT_TOKEN = token;
        if (isDev) {
            window.YACK_DEV = true;
        }
        else {
            window.YACK_DEV = false;
        }
    }
}
exports.initDevKit = initDevKit;
/**
 * Retreives the token on the window object
 */
function getToken() {
    if (window.YACK_DEVKIT_TOKEN === null)
        throw new Error("Please intialize before using");
    return window.YACK_DEVKIT_TOKEN;
}
exports.getToken = getToken;
/**
 * Polls the document scrollHeight and sends a message to Yack
 * to adjust the containing iframe
 */
function syncMessageHeight(resizeId) {
    let currentHeight = 0;
    // Important: we want to only run this once
    // (once there is a descrepency)
    // const interval: any =
    setInterval(() => {
        const document = window.document.documentElement;
        const scrollHeight = document.scrollHeight;
        if (scrollHeight !== currentHeight) {
            currentHeight = scrollHeight;
            const message = {
                type: "SYNC_MESSAGE_HEIGHT",
                content: {
                    resizeId,
                    resizeHeight: scrollHeight,
                }
            };
            // Send our message to the app
            postAppMessage(message);
            // Keep the window height in sync
            // Now kill it so it doesn't run the whole time
            // clearInterval(interval);
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
 * @param {String} name - Panel title
 * @param {String} url - Panel URL
 * @param {String} channelToken - Channel app token
 */
function openAppPanel(name, url, channelToken) {
    const payload = {
        url,
    };
    const action = {
        type: "panel",
        name,
        payload,
        token: channelToken,
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
 * @param {String} name - Modal title
 * @param {String} url - Modal URL
 * @param {String} height - Modal height
 * @param {String} width - Modal width
 * @param {String} channelToken - Channel app token
 */
function openAppModal(name, url, width, height, channelToken) {
    const payload = {
        url,
        height,
        width,
    };
    const action = {
        type: "modal",
        name,
        payload,
        token: channelToken,
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
 * @param {String} channelToken - temp channel intsall token
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - string identifying the remote resource
 */
function createChannelMessage(channelToken, message, attachments, resourceId) {
    const appToken = getToken();
    return fetch(`${WEBHOOK_URL}/${channelToken}`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + appToken,
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify({ message, attachments, resourceId })
    });
}
exports.createChannelMessage = createChannelMessage;
/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} resourceId - string identifying the remote resource
 */
function deleteChannelMessagesWithResourceId(channelToken, resourceId) {
    const appToken = getToken();
    return fetch(`${WEBHOOK_URL}/${channelToken}/resource/${resourceId}`, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + appToken,
        },
        redirect: "follow",
        referrer: "no-referrer",
    });
}
exports.deleteChannelMessagesWithResourceId = deleteChannelMessagesWithResourceId;
/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - new string identifying the remote resource
 * @param {String} currentResourceId - old string identifying the remote resource
 */
function updateChannelMessagesWithResourceId(channelToken, message, attachments, currentResourceId, resourceId) {
    const appToken = getToken();
    return fetch(`${WEBHOOK_URL}/${channelToken}/resource/${currentResourceId}`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + appToken,
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify({ message, attachments, resourceId })
    });
}
exports.updateChannelMessagesWithResourceId = updateChannelMessagesWithResourceId;
/**
 * ⚠️ Unimplemented ⚠️
 * Tells the app store than auth has completed
 * And to close the auth modal automagically
 */
function authComplete() {
    const message = {
        type: "AUTH_COMPLETE",
    };
    postAppMessage(message);
}
exports.authComplete = authComplete;
//# sourceMappingURL=index.js.map