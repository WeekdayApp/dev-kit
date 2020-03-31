import { IPayload } from "./IPayload";
/**
 * Correposnds to type AppAction
 */
export interface IAction {
    type: string;
    name: string;
    payload: IPayload | null;
    token: string | null;
}
