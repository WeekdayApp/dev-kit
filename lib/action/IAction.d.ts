import { IPayload } from "./IPayload";
export interface IAction {
    type: string;
    name: string;
    payload: IPayload | null;
}
