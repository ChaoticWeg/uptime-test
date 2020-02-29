import {TimerService} from './TimerService';
import {EventEmitter} from '../lib';

const HeartbeatInternalStatus = {
    Waiting: 0,
    Connecting: 1
};

export const HeartbeatStatus = {
    Initializing: 'initializing',
    Connected: 'connected',
    Error: 'error'
};

class HeartbeatServiceClass extends EventEmitter {

    constructor() {
        super();

        this._lastRequestMs = 0;
        this._lastSuccessMs = 0;

        this._error = null;

        this._internalStatus = HeartbeatInternalStatus.Waiting;
        this._status = HeartbeatStatus.Initializing;

        TimerService.on('tick', this._onTick.bind(this));
    }

    get lastSuccess() {
        return this._lastSuccessMs;
    }

    get pingDelayMs() {
        return 5000;
    }

    get error() {
        return this._error;
    }

    get status() {
        return this._status;
    }

    _onConnectionSuccess(ms) {
        this._lastSuccessMs = ms;
        this._error = null;
        this._internalStatus = HeartbeatInternalStatus.Waiting;
        this._status = HeartbeatStatus.Connected;

        this.emit('success', {timestamp: ms});
        this.emit('heartbeat', {
            status: HeartbeatStatus.Connected,
            data: {timestamp: ms}
        });
    }

    _onConnectionError(err) {
        this._error = err;
        this._internalStatus = HeartbeatInternalStatus.Waiting;
        this._status = HeartbeatStatus.Error;

        this.emit('error', err);
        this.emit('heartbeat', {
            status: HeartbeatStatus.Error,
            error: err
        });
    }

    _onTick() {
        // Do not make more than one request at a time
        if (this._internalStatus === HeartbeatInternalStatus.Connecting) {
            return;
        }

        // Throttle requests
        if (Date.now() - this._lastRequestMs < this.pingDelayMs) {
            return;
        }

        this._ping();
    }

    _ping() {
        const onSuccess = this._onConnectionSuccess.bind(this);
        const onError = this._onConnectionError.bind(this);

        this._lastRequestMs = Date.now();
        this._internalStatus = HeartbeatInternalStatus.Connecting;

        fetch('https://api.chaoticweg.cc/api/heartbeat')
            .then(res => res.json())
            .then(onSuccess, onError);
    }

}

export const HeartbeatService = new HeartbeatServiceClass();
