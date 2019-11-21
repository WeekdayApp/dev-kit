import { IAction } from "../action/IAction";
export interface IMessage {
    type: string;
    action?: IAction;
    resizeId?: string;
    payload?: any;
}
