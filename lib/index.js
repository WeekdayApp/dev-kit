"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Keg queue class
 * @class
 * @constructor
 * @public
 */
class Keg {
    constructor(name) {
        this.taps = {};
        this.queue = {};
        this.spikes = {};
        this.name = "";
        this.name = name;
    }
    /**
     * Initialized the singletone factory
     * @param {String} kegName - ID for the object
     */
    static keg(kegName) {
        // If it doesn't exist, create it
        if (!this.instances[kegName])
            this.instances[kegName] = new Keg(kegName);
        // Return the correct keg to use
        return this.instances[kegName];
    }
    /**
     * Initialized the listening mechanic
     * @param {String} tapName - topic for the queue
     * @param {Object} callback - function for each call to process the q
     * @param {Object} empty - function for when it's completed
     */
    tap(tapName, callback, empty) {
        // If this outlet doesn't exist - create the array
        // So the push doesn't break
        if (!this.taps[tapName])
            this.taps[tapName] = [];
        // Push our callback/empty to the stack
        this.taps[tapName].push({ callback, empty });
        // Run it as soon as it's up
        // There might be nothing
        this.pour(tapName);
    }
    /**
     * Add midldeware
     * @param {String} tapName - specifies the queue
     * @param {Object} callback - middleware function the value passes through
     */
    spike(tapName, func) {
        // If this spike doesn't exist, create it
        if (!this.spikes[tapName])
            this.spikes[tapName] = [];
        // Add this value to the Q
        this.spikes[tapName].push(func);
    }
    /**
     * Outlet and sending values to listeners
     * @param {String} tapName - specifies the queue
     */
    pour(tapName) {
        // If there is no queue - return
        if (!this.queue[tapName])
            return;
        // Value to push out
        let value = this.queue[tapName][0];
        // If there is no value - return
        if (!value)
            return;
        // Spike our drink
        if (this.spikes[tapName]) {
            value = this.spikes[tapName].reduce((accumulator, currentValue) => currentValue(accumulator), value);
        }
        // Pour it into all the taps
        // Then also give our tap a function to move to the next one
        this.taps[tapName].map((tap) => tap.callback(value, () => {
            // Remove the current one from the stack
            this.queue[tapName].shift();
            // If it's empty (not uncreated)
            // then call the empty one
            // Or pour it again
            if (this.queue[tapName].length == 0) {
                this.taps[tapName].map((tap) => {
                    if (tap.empty)
                        tap.empty();
                });
            }
            else {
                this.pour(tapName);
            }
        }));
    }
    /**
     * Adds a message to the queue
     * @param {String} tapName - specifies the queue
     * @param {Object} value - actual message
     */
    refill(tapName, value) {
        // If this tap doesn't exist, create it
        if (!this.queue[tapName])
            this.queue[tapName] = [];
        // Add this value to the Q
        this.queue[tapName].push(value);
        // Also check it's there - don't refill something can doesn't exist
        if (!this.taps[tapName])
            return;
        // And then only ever auto run the top value
        // Important for sending a syncronous stream - 1 by 1
        if (this.queue[tapName].length == 1)
            this.pour(tapName);
    }
}
exports.default = Keg;
Keg.instances = {};
//# sourceMappingURL=index.js.map