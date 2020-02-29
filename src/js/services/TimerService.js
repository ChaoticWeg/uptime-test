import moment from 'moment';
import {EventEmitter} from '../lib';

class TimerServiceClass extends EventEmitter {

    constructor(tickMs = 1000) {
        super();

        this._tickMs = tickMs;
        this._interval = null;
    }

    _handleTick() {
        this.emit('tick', moment());
    }

    start() {
        this._interval = setInterval(this._handleTick.bind(this), this._tickMs);
    }

    stop() {
        clearInterval(this._interval);
        this._interval = null;
    }

}

export const TimerService = new TimerServiceClass();
