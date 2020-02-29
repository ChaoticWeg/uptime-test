'use strict';

import React, {useEffect, useState} from 'react';
import moment from 'moment';

import {HeartbeatService, HeartbeatStatus, TimerService} from '../services';

export const UptimeDisplay = (props) => {
    const {startTime} = props;

    const [currentTime, setCurrentTime] = useState(startTime);
    const [connected, setConnected] = useState(false);
    const [lastConnection, setLastConnection] = useState(null);
    const [status, setStatus] = useState(HeartbeatStatus.Initializing);
    const [error, setError] = useState(null);

    const [timeText, setTimeText] = useState(null);
    const [uptimeText, setUptimeText] = useState(null);
    const [statusText, setStatusText] = useState(null);
    const [errorText, setErrorText] = useState(null);

    useEffect(_componentDidMount, []);
    useEffect(_updateUI, [currentTime, status, connected]);

    function _componentDidMount() {
        _updateUI();

        TimerService.on('tick', _onTick);
        HeartbeatService.on('heartbeat', _onHeartbeat);
    }

    function _renderTime(time) {
        if (time) {
            return `${time.format('DD MMM YYYY')} at ${time.format('H:mm:ss')}`;
        }
    }

    function _onTick(momentInst) {
        setCurrentTime(momentInst);
    }

    function _onHeartbeat(data) {
        setStatus(data.status);

        if (data.status === HeartbeatStatus.Connected && !connected) {
            setLastConnection(moment());
            setConnected(true);
        }

        if (data.error) {
            setConnected(false);
            setError(data.error);
        }

        setStatus(data.status);
    }

    function _updateUI() {
        if (currentTime) {
            setTimeText(_renderTime(currentTime));
            setUptimeText(connected ? moment.duration(lastConnection - currentTime).humanize() : 'N/A');
        }

        if (status) {
            setStatusText(status);
        }

        if (error) {
            setErrorText(error.message);
        }
    }

    return (
        <div>
            <pre>
                Test started: {_renderTime(startTime)}<br/>
                Current time: {timeText}
            </pre>
            <pre>
                Uptime: {uptimeText}<br/>
                Status: {statusText}
            </pre>
            {
                error && <pre>{errorText}</pre>
            }
        </div>
    );

};
