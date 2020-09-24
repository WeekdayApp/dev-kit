import { IPayload } from "./IPayload";
/**
 * Interface for actions
 *
 * @interface IAction
 */
export interface IAction {
    type: string;
    name: string;
    payload: IPayload | null;
    token: string | null;
}
