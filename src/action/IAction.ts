import { IPayload } from "./IPayload";

/**
 * Correposnds to type AppAction
 */
export interface IAction {
  type: string;
  name: string;
  payload: IPayload | null;

  // This is the only addition to the underlying datamodel
  // Every action that is dispatched across the system has the channel token
  // identifier attached to identify which channel its actioned on
  token: string | null;
}
