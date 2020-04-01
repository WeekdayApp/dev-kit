"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WEBHOOK_URL = "http://localhost:8181/v1/webhook";
/**
 * Stores the token on the window object
 * @param {String} token - App token
 */
function initDevKit(token) {
    console.log('DevKit token: ', token);
    window.YACK_DEVKIT_TOKEN = token;
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
function autoAdjustMessageHeight() {
    let currentHeight = 0;
    // Important: we want to only run this once
    // (once there is a descrepency)
    const interval = setInterval(() => {
        const document = window.document.documentElement;
        const scrollHeight = document.scrollHeight;
        if (scrollHeight !== currentHeight) {
            currentHeight = scrollHeight;
            window.location.search.split("&").map((query) => {
                const parts = query.split("=");
                if (parts[0] === "resizeId" && parts.length === 2) {
                    const message = {
                        type: "AUTO_ADJUST_MESSAGE_HEIGHT",
                        content: {
                            resizeId: parts[1],
                            resizeHeight: scrollHeight,
                        }
                    };
                    // Send our message to the app
                    postAppMessage(message);
                    // Now kill it so it doesn't run the whole time
                    clearInterval(interval);
                }
            });
        }
    }, 500);
}
exports.autoAdjustMessageHeight = autoAdjustMessageHeight;
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
/**
 * Sends a message to the parent window
 * @param {IMessage} message - Message object
 */
function postAppMessage(message) {
    window.top.postMessage(message, "*");
}
exports.postAppMessage = postAppMessage;
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
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - new string identifying the remote resource
 * @param {String} messageId - id of message to update
 */
function updateChannelMessage(channelToken, message, attachments, messageId, resourceId) {
    const appToken = getToken();
    return fetch(`${WEBHOOK_URL}/${channelToken}/message/${messageId}`, {
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
exports.updateChannelMessage = updateChannelMessage;
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
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} messageId - string identifiying the channel app message
 */
function deleteChannelMessage(channelToken, messageId) {
    const appToken = getToken();
    return fetch(`${WEBHOOK_URL}/${channelToken}/message/${messageId}`, {
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
exports.deleteChannelMessage = deleteChannelMessage;
//# sourceMappingURL=index.js.map