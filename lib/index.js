"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Stores the token on the window object
 * @param {String} token - App token
 */
function init(token) {
    window.WEEKDAY_DEVKIT_TOKEN = token;
}
exports.init = init;
/**
 * Retreives the token on the window object
 */
function getToken() {
    if (window.WEEKDAY_DEVKIT_TOKEN === null)
        throw new Error("Please intialize before using");
    return window.WEEKDAY_DEVKIT_TOKEN;
}
exports.getToken = getToken;
/**
 * Polls the document scrollHeight and sends a message to Weekday
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
                if (parts[0] === "weekdayId" && parts.length === 2) {
                    const message = {
                        type: "AUTO_ADJUST_MESSAGE_HEIGHT",
                        weekdayId: parts[1],
                        payload: { scrollHeight },
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
 */
function closeAppModal() {
    const action = {
        type: "modal-close",
    };
    const message = {
        type: "DISPATCH_APP_ACTION",
        action,
    };
    postAppMessage(message);
}
exports.closeAppModal = closeAppModal;
/**
 * Closes an app panel
 */
function closeAppPanel() {
    const action = {
        type: "panel-close",
    };
    const message = {
        type: "DISPATCH_APP_ACTION",
        action,
    };
    postAppMessage(message);
}
exports.closeAppPanel = closeAppPanel;
/**
 * Opens an app panel with an action
 * @param {String} name - Panel title
 * @param {String} name - Panel URL
 */
function openAppPanel(name, url) {
    const action = {
        type: "panel",
        name,
        url,
    };
    const message = {
        type: "DISPATCH_APP_ACTION",
        action,
    };
    postAppMessage(message);
}
exports.openAppPanel = openAppPanel;
/**
 * Opens an app modal with an action
 * @param {String} name - Modal title
 * @param {String} name - Modal URL
 */
function openAppModal(name, url) {
    const action = {
        type: "modal",
        name,
        url,
    };
    const message = {
        type: "DISPATCH_APP_ACTION",
        action,
    };
    postAppMessage(message);
}
exports.openAppModal = openAppModal;
/**
 * Sends a message to the parent window
 * @param {IMessage} message - Message object
 */
function postAppMessage(message) {
    window.top.postMessage(message, "*");
}
exports.postAppMessage = postAppMessage;
//# sourceMappingURL=index.js.map