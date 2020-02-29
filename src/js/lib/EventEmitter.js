export class EventEmitter {

    constructor() {
        this._events = {};
    }

    /**
     * Add a handler that is called when an event fires.
     * @param key The event to listen for
     * @param handler The handler to call when the event fires
     * @private
     */
    _addHandler(key, handler) {
        if (typeof handler !== 'function') {
            throw new Error(`Tried to pass ${handler.constructor.name} to EventEmitter#_addHandler, but it is not callable!`);
        }

        if (!this._events.hasOwnProperty(key)) {
            this._events[key] = [];
        }

        this._events[key].push(handler);
    }

    /**
     * Fire an event, calling all registered handlers for the event.
     * @param key The event which we are firing
     * @param args The args to pass to all event handlers
     */
    emit(key, args) {
        if (!this._events.hasOwnProperty(key)) {
            return;
        }

        this._events[key].forEach(h => {
            if (typeof h === 'function') {
                h(args);
            }
        });
    }

    /**
     * Add a handler that is called when an event fires.
     * @param key The event to listen for
     * @param handler The handler to call when the event fires
     */
    on(key, handler) {
        if (typeof handler !== 'function') {
            throw new Error(`Tried to pass ${handler.constructor.name} to EventEmitter#on, but it is not callable!`);
        }

        this._addHandler(key, handler);
    }

    /**
     * Remove a handler.
     * @param key The event for whom this handler is registered
     * @param handler The handler to remove
     */
    off(key, handler) {
        if (!this._events.hasOwnProperty(key)) {
            return;
        }

        delete this._events[key][handler];
    }

}
