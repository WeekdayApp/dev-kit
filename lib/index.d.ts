import { IMessage } from "./message/IMessage";
import { IAttachment } from "./attachment/IAttachment";
declare global {
    interface Window {
        YACK_DEVKIT_TOKEN: string;
    }
}
/**
 * Sends a message to the parent window
 * @param {IMessage} message - Message object
 */
export declare function postAppMessage(message: IMessage): void;
/**
 * Stores the token on the window object
 * @param {String} token - App token
 */
export declare function initDevKit(token: string): void;
/**
 * Retreives the token on the window object
 */
export declare function getToken(): string;
/**
 * Polls the document scrollHeight and sends a message to Yack
 * to adjust the containing iframe
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
 * @param {String} name - Panel title
 * @param {String} url - Panel URL
 * @param {String} channelToken - Channel app token
 */
export declare function openAppPanel(name: string, url: string, channelToken: string): void;
/**
 * Opens an app modal with an action
 * @param {String} name - Modal title
 * @param {String} url - Modal URL
 * @param {String} height - Modal height
 * @param {String} width - Modal width
 * @param {String} channelToken - Channel app token
 */
export declare function openAppModal(name: string, url: string, width: string, height: string, channelToken: string): void;
/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - string identifying the remote resource
 */
export declare function createChannelMessage(channelToken: string, message: string, attachments: [IAttachment], resourceId: string): Promise<Response>;
/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} resourceId - string identifying the remote resource
 */
export declare function deleteChannelMessagesWithResourceId(channelToken: string, resourceId: string): Promise<Response>;
/**
 * Unused parts that need to be QA'd
 * ------------------------------------------
 */
/**
 * Tells the app store than auth has completed
 * And to close the auth modal automagically
 */
export declare function authComplete(): void;
/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - new string identifying the remote resource
 * @param {String} messageId - id of message to update
 */
export declare function updateChannelMessage(channelToken: string, message: string | null, attachments: [IAttachment] | null, messageId: string, resourceId: string): Promise<Response>;
/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - new string identifying the remote resource
 * @param {String} currentResourceId - old string identifying the remote resource
 */
export declare function updateChannelMessagesWithResourceId(channelToken: string, message: string | null, attachments: [IAttachment] | null, currentResourceId: string, resourceId: string): Promise<Response>;
/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} messageId - string identifiying the channel app message
 */
export declare function deleteChannelMessage(channelToken: string, messageId: string): Promise<Response>;
