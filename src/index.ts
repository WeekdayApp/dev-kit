import { IAction } from "./action/IAction";
import { IMessage } from "./message/IMessage";
import { IAttachment } from "./attachment/IAttachment";

const WEBHOOK_URL: string = "https://api.weekday.sh/v1/webhook";

declare global {
  interface Window { WEEKDAY_DEVKIT_TOKEN: string; }
}

/**
 * Stores the token on the window object
 * @param {String} token - App token
 */
export function initDevKit(token: string): void {
  window.WEEKDAY_DEVKIT_TOKEN = token;
}

/**
 * Retreives the token on the window object
 */
export function getToken(): string {
  if (window.WEEKDAY_DEVKIT_TOKEN === null) throw new Error("Please intialize before using");

  return window.WEEKDAY_DEVKIT_TOKEN;
}

/**
 * Polls the document scrollHeight and sends a message to Weekday
 * to adjust the containing iframe
 */
export function autoAdjustMessageHeight(): void {
   let currentHeight: number = 0;

   // Important: we want to only run this once
   // (once there is a descrepency)
   const interval: any = setInterval(() => {
     const document: any = window.document.documentElement;
     const scrollHeight: number = document.scrollHeight;

     if (scrollHeight !== currentHeight) {
       currentHeight = scrollHeight;

       window.location.search.split("&").map((query: string) => {
         const parts: string[] = query.split("=");

         if (parts[0] === "resizeId" && parts.length === 2) {
           const message: IMessage = {
             type: "AUTO_ADJUST_MESSAGE_HEIGHT",
             resizeId: parts[1],
             payload: scrollHeight,
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

 /**
  * Closes an app modal
  */
export function closeAppModal(): void {
  const action: IAction = {
    type: "modal-close",
  };

  const message: IMessage = {
    type: "DISPATCH_APP_ACTION",
    action,
  };

  postAppMessage(message);
}

/**
 * Closes an app panel
 */
export function closeAppPanel(): void {
  const action: IAction = {
    type: "panel-close",
  };

  const message: IMessage = {
    type: "DISPATCH_APP_ACTION",
    action,
  };

  postAppMessage(message);
}

/**
 * Opens an app panel with an action
 * @param {String} name - Panel title
 * @param {String} name - Panel URL
 */
export function openAppPanel(name: string, url: string): void {
  const action: IAction = {
    type: "panel",
    name,
    url,
  };

  const message: IMessage = {
    type: "DISPATCH_APP_ACTION",
    action,
  };

  postAppMessage(message);
}

/**
 * Opens an app modal with an action
 * @param {String} name - Modal title
 * @param {String} name - Modal URL
 */
export function openAppModal(name: string, url: string): void {
  const action: IAction = {
    type: "modal",
    name,
    url,
  };

  const message: IMessage = {
    type: "DISPATCH_APP_ACTION",
    action,
  };

  postAppMessage(message);
}

/**
 * Tells the app store than auth has completed
 * And to close the auth modal automagically
 */
export function authComplete(): void {
  const message: IMessage = {
    type: "AUTH_COMPLETE",
  };

  postAppMessage(message);
}

/**
 * Sends a message to the parent window
 * @param {IMessage} message - Message object
 */
export function postAppMessage(message: IMessage): void {
  window.top.postMessage(message, "*");
}

/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - string identifying the remote resource
 */
export function createChannelMessage(
  channelToken: string,
  message: string,
  attachments: [IAttachment],
  resourceId: string
): Promise<Response> {
  const appToken: string = getToken()
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

/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - new string identifying the remote resource
 * @param {String} messageId - id of message to update
 */
export function updateChannelMessage(
  channelToken: string,
  message: string | null,
  attachments: [IAttachment] | null,
  messageId: string,
  resourceId: string,
): Promise<Response> {
  const appToken: string = getToken()
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

/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} resourceId - string identifying the remote resource
 */
export function deleteChannelMessagesWithResourceId(
  channelToken: string,
  resourceId: string,
): Promise<Response> {
  const appToken: string = getToken()
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

/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} message - text message for the channel message
 * @param {[IAttachment]} attachments - list of attachments to include
 * @param {String} resourceId - new string identifying the remote resource
 * @param {String} currentResourceId - old string identifying the remote resource
 */
export function updateChannelMessagesWithResourceId(
  channelToken: string,
  message: string | null,
  attachments: [IAttachment] | null,
  currentResourceId: string,
  resourceId: string,
): Promise<Response> {
  const appToken: string = getToken()
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

/**
 * Creates a channel message using app channel webhook
 * @param {String} channelToken - temp channel intsall token
 * @param {String} messageId - string identifiying the channel app message
 */
export function deleteChannelMessage(
  channelToken: string,
  messageId: string,
): Promise<Response> {
  const appToken: string = getToken()
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
