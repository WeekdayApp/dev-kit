import { IAction } from "../action/IAction";

export interface IMessage {
  type: string;
  action?: IAction;
  weekdayId?: string;
  payload?: any;
}
