import { IAction } from "./action/IAction";
import { IPayload } from "./action/IPayload";
import { IMessage } from "./message/IMessage";
import { IAttachment } from "./attachment/IAttachment";

// This will be sexier in future
const WEBHOOK_URL_PRODUCTION: string = "https://api.yack.co/v1/webhook";
const WEBHOOK_URL_DEVELOPMENT: string = "http://localhost:8181/v1/webhook";
const WEBHOOK_URL: string = window.YACK_DEV ? WEBHOOK_URL_DEVELOPMENT : WEBHOOK_URL_PRODUCTION;

declare global {
  interface Window {
    YACK_DEVKIT_TOKEN: string;
    YACK_DEV: boolean;
  }
}

/**
 * Sends a message to the parent window
 * @param {IMessage} message - Message object
 */
export function postAppMessage(message: IMessage): void {
  window.top.postMessage(message, "*");
}

/**
 * Stores the token on the window object
 * @param {String} token - App token
 */
export function initDevKit(token: string, isDev: boolean): void {
  console.log('DevKit token: ', token)

  if (window) {
    window.YACK_DEVKIT_TOKEN = token;
    if (isDev) {
      window.YACK_DEV = true;
    } else {
      window.YACK_DEV = false;
    }
  }
}

/**
 * Retreives the token on the window object
 */
export function getToken(): string {
  if (window.YACK_DEVKIT_TOKEN === null) throw new Error("Please intialize before using");

  return window.YACK_DEVKIT_TOKEN;
}

/**
 * Polls the document scrollHeight and sends a message to Yack
 * to adjust the containing iframe
 */
export function syncMessageHeight(resizeId: string): void {
   let currentHeight: number = 0;

   // Important: we want to only run this once
   // (once there is a descrepency)
   // const interval: any =
   setInterval(() => {
     const document: any = window.document.documentElement;
     const scrollHeight: number = document.scrollHeight;

     if (scrollHeight !== currentHeight) {
       currentHeight = scrollHeight;

       const message: IMessage = {
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

 /**
  * Closes an app modal
  * * Don't use a channel token here - it's a simple action
  */
export function closeAppModal(): void {
  const action: IAction = {
    type: "modal-close",
    name: "MODAL CLOSE",
    payload: null,
    token: null,
  };

  const message: IMessage = {
    type: "DISPATCH_APP_ACTION",
    content: { action },
  };

  postAppMessage(message);
}

/**
 * Closes an app panel
 * Don't use a channel token here - it's a simple action
 */
export function closeAppPanel(): void {
  const action: IAction = {
    type: "panel-close",
    name: "PANEL CLOSE",
    payload: null,
    token: null,
  };

  const message: IMessage = {
    type: "DISPATCH_APP_ACTION",
    content: { action },
  };

  postAppMessage(message);
}

/**
 * Opens an app panel with an action
 * @param {String} name - Panel title
 * @param {String} url - Panel URL
 * @param {String} channelToken - Channel app token
 */
export function openAppPanel(name: string, url: string, channelToken: string): void {
  const payload: IPayload = {
    url,
  };

  const action: IAction = {
    type: "panel",
    name,
    payload,
    token: channelToken,
  };

  const message: IMessage = {
    type: "DISPATCH_APP_ACTION",
    content: { action },
  };

  postAppMessage(message);
}

/**
 * Opens an app modal with an action
 * @param {String} name - Modal title
 * @param {String} url - Modal URL
 * @param {String} height - Modal height
 * @param {String} width - Modal width
 * @param {String} channelToken - Channel app token
 */
export function openAppModal(
  name: string,
  url: string,
  width: string,
  height: string,
  channelToken: string
): void {
  const payload: IPayload = {
    url,
    height,
    width,
  };

  const action: IAction = {
    type: "modal",
    name,
    payload,
    token: channelToken,
  };

  const message: IMessage = {
    type: "DISPATCH_APP_ACTION",
    content: { action },
  };

  postAppMessage(message);
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
  * ⚠️ Unimplemented ⚠️
  * Tells the app store than auth has completed
  * And to close the auth modal automagically
  */
 export function authComplete(): void {
   const message: IMessage = {
     type: "AUTH_COMPLETE",
   };

   postAppMessage(message);
 }
