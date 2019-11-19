/**
 * Keg queue class
 * @class
 * @constructor
 * @public
 */
export default class Keg {
    static instances: any;
    taps: any;
    queue: any;
    spikes: any;
    name: string;
    constructor(name: string);
    /**
     * Initialized the singletone factory
     * @param {String} kegName - ID for the object
     */
    static keg(kegName: string): any;
    /**
     * Initialized the listening mechanic
     * @param {String} tapName - topic for the queue
     * @param {Object} callback - function for each call to process the q
     * @param {Object} empty - function for when it's completed
     */
    tap(tapName: string, callback: any, empty: any): void;
    /**
     * Add midldeware
     * @param {String} tapName - specifies the queue
     * @param {Object} callback - middleware function the value passes through
     */
    spike(tapName: string, func: any): void;
    /**
     * Outlet and sending values to listeners
     * @param {String} tapName - specifies the queue
     */
    pour(tapName: string): void;
    /**
     * Adds a message to the queue
     * @param {String} tapName - specifies the queue
     * @param {Object} value - actual message
     */
    refill(tapName: string, value: any): void;
}
