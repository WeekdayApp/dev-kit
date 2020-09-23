import { IAction } from "./action/IAction";
import { IPayload } from "./action/IPayload";
import { IMessage } from "./message/IMessage";
import { IAttachment } from "./attachment/IAttachment";
import { API_DEVELOPMENT, API_PRODUCTION, ERRORS } from './constants';

declare global {
  interface Window {
    syncMessageHeight: any,
    WEEKDAY_DEVKIT_TOKEN: string;
    API_URL: string;
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
export function initDevKit(token: string, dev: boolean): boolean {
  if (window) {
    window.WEEKDAY_DEVKIT_TOKEN = token;
    window.API_URL = dev ? API_DEVELOPMENT : API_PRODUCTION;
    return true;
  } else {
    throw new Error(ERRORS.NO_NODEJS)
  }
}

/**
 * Retreives the userId from the URL
 * This URL will always be available in a sandboxed environment
 */
export function getUserId(): any {
  const url: string = window.location.href;
  const queryString: string = url.split("?")[1];

  if (!queryString) throw new Error(ERRORS.NO_USER_ID);

  const parameters: string[] = queryString.split("&");
  let userIdParameterValue: string = "";

  // Iterate over the parameter to find the userId
  // If we find it, then we save above
  parameters.filter(parameter => {
    const parameterParts: string[] = parameter.split("=");
    const key: string = parameterParts[0];
    const value: string = parameterParts[1];

    // We found it
    if (key == "userId") userIdParameterValue = value;
  });
  
  // If we couldn't find it, then boohoo
  if (userIdParameterValue == "") throw new Error(ERRORS.NO_USER_ID);

  // Otherwise return it
  return userIdParameterValue;
}

/**
 * Retreives the token on the window object
 */
export function getToken(): string {
  let token: string = "";

  // If it's a browser
  if (window) {
    if (window.WEEKDAY_DEVKIT_TOKEN === null) throw new Error(ERRORS.PLEASE_INIT);
    token = window.WEEKDAY_DEVKIT_TOKEN;
  } else {
    throw new Error(ERRORS.NO_NODEJS);
  }

  return token;
}

/**
 * Polls the document scrollHeight and sends a message to Weekday
 * to adjust the containing iframe
 */
export function syncMessageHeight(resizeId: string): void {
   let currentHeight: number = -1;

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
  body: string,
  attachments: [IAttachment],
  resourceId: string,
  userId: string,
): Promise<Response> {
  const appToken: string = getToken()
  //const userId: any = getUserId()
  return fetch(`${window.API_URL}/app/message`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "weekdayapp": appToken,
    },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify({ body, attachments, resourceId, userId, channelToken })
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
  return fetch(`${window.API_URL}/app/channel/${channelToken}/resource/${resourceId}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "weekdayapp": appToken,
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
  body: string | null,
  attachments: [IAttachment] | null,
  currentResourceId: string,
  resourceId: string,
): Promise<Response> {
  const appToken: string = getToken()
  return fetch(`${window.API_URL}/app/message`, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "weekdayapp": appToken,
    },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify({ body, attachments, resourceId, channelToken, currentResourceId })
  });
}
