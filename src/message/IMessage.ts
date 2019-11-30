import { IAction } from "../action/IAction";
import { IPayload } from "../action/IPayload";

export interface IMessage {
  type: string;
  action?: IAction;
  payload?: any;
}
