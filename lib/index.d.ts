import { IMessage } from "./message/IMessage";
declare global {
    interface Window {
        WEEKDAY_DEVKIT_TOKEN: string;
    }
}
/**
 * Stores the token on the window object
 * @param {String} token - App token
 */
export declare function init(token: string): void;
/**
 * Retreives the token on the window object
 */
export declare function getToken(): string;
/**
 * Polls the document scrollHeight and sends a message to Weekday
 * to adjust the containing iframe
 */
export declare function autoAdjustMessageHeight(): void;
/**
 * Closes an app modal
 */
export declare function closeAppModal(): void;
/**
 * Closes an app panel
 */
export declare function closeAppPanel(): void;
/**
 * Opens an app panel with an action
 * @param {String} name - Panel title
 * @param {String} name - Panel URL
 */
export declare function openAppPanel(name: string, url: string): void;
/**
 * Opens an app modal with an action
 * @param {String} name - Modal title
 * @param {String} name - Modal URL
 */
export declare function openAppModal(name: string, url: string): void;
/**
 * Sends a message to the parent window
 * @param {IMessage} message - Message object
 */
export declare function postAppMessage(message: IMessage): void;
