import { IMessage } from "./message/IMessage";
import { IAttachment } from "./attachment/IAttachment";
declare global {
    interface Window {
        syncMessageHeight: any;
        WEEKDAY_DEVKIT_TOKEN: string;
        API_URL: string;
    }
}
/**
 * Sends a message to the parent window
 * @param {IMessage} message - Message object
 */
export declare function postAppMessage(message: IMessage): void;
/**
 * Stores the token on the window object
 * @param {string} token - App token
 * @param {boolean} dev - sets the correct URL to use
 */
export declare function initDevKit(token: string, dev: boolean): boolean;
/**
 * Retreives the userId from the URL
 * This URL will always be available in a sandboxed environment
 */
export declare function getUserId(): any;
/**
 * Retreives the token on the window object
 */
export declare function getToken(): string;
/**
 * Polls the document scrollHeight and sends a message to Weekday
 * to adjust the containing iframe
 * @param {string} resizeId - A UUID identifying a single message iframe
 */
export declare function syncMessageHeight(resizeId: string): void;
/**
 * Closes an app modal
 * * Don't use a channel token here - it's a simple action
 */
export declare function closeAppModal(): void;
/**
 * Closes an app panel
 * Don't use a channel token here - it's a simple action
 */
export declare function closeAppPanel(): void;
/**
 * Opens an app panel with an action
 * @param {string} name - Panel title
 * @param {string} url - Panel iframe URL
 * @param {string} channelToken - Channel app token (generated when an app is installed on a channel)
 */
export declare function openAppPanel(name: string, url: string, channelToken: string): void;
/**
 * Opens an app modal with an action
 * @param {string} name - Modal title
 * @param {string} url - Modal URL
 * @param {string} height - Modal height, can be % or px
 * @param {string} width - Modal width, can be % or px
 * @param {string} channelToken - Channel app token
 */
export declare function openAppModal(name: string, url: string, width: string, height: string, channelToken: string): void;
/**
 * Creates a channel message using app channel webhook
 * @param {string} channelToken - temp channel intsall token
 * @param {string} body - text message for the channel message
 * @param {Array.<IAttachment>} attachments - list of attachments to include
 * @param {string} resourceId - string identifying the remote resource
 * @param {string} userId - a userId for the user (passed as a query string parameter)
 */
export declare function createChannelMessage(channelToken: string, body: string, attachments: [IAttachment], resourceId: string, userId: string): Promise<Response>;
/**
 * Creates a channel message using app channel webhook
 * @param {string} channelToken - temp channel intsall token
 * @param {string} resourceId - string identifying the remote resource
 */
export declare function deleteChannelMessagesWithResourceId(channelToken: string, resourceId: string): Promise<Response>;
/**
 * Creates a channel message using app channel webhook
 * @param {string} channelToken - temp channel intsall token
 * @param {string} body - text message for the channel message
 * @param {Array.<IAttachment>} attachments - list of attachments to include
 * @param {string} currentResourceId - old string identifying the remote resource
 * @param {string} resourceId - new string identifying the remote resource
 */
export declare function updateChannelMessagesWithResourceId(channelToken: string, body: string | null, attachments: [IAttachment] | null, currentResourceId: string, resourceId: string): Promise<Response>;
