'use strict';

import React, {useEffect, useState} from 'react';
import {HeartbeatService, HeartbeatStatus, TimerService} from '../services';

export const UptimeDisplay = (props) => {
    const {startTime} = props;

    const [time, setTime] = useState(startTime);
    const [status, setStatus] = useState(HeartbeatStatus.Initializing);
    const [error, setError] = useState(null);

    const [timeText, setTimeText] = useState(null);
    const [statusText, setStatusText] = useState(null);
    const [errorText, setErrorText] = useState(null);

    useEffect(_componentDidMount, []);
    useEffect(_updateUI, [time, status]);

    function _componentDidMount() {
        _updateUI();

        TimerService.on('tick', _onTick);
        HeartbeatService.on('heartbeat', _onHeartbeat);
    }

    function _renderTime(moment) {
        if (moment) {
            return `${moment.format('DD MMM YYYY')} at ${moment.format('H:mm:ss')}`;
        }
    }

    function _onTick(moment) {
        setTime(moment);
    }

    function _onHeartbeat(data) {
        if (data.error) {
            setError(data.error);
        }

        setStatus(data.status);
    }

    function _updateUI() {
        if (time) {
            setTimeText(_renderTime(time));
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
            <pre>Status: {statusText}</pre>
            {
                error && <pre>{errorText}</pre>
            }
        </div>
    );

};


export class UptimeDisplayCls extends React.Component {

    constructor(props) {
        super(props);
    }

    _renderStarting() {
        return (
            <>
                <p>Test initializing...</p>
                <p>Uptime: none</p>
            </>
        );
    }

    _renderTime(time) {
        return `${time.format('D MMM YYYY')} at ${time.format('H:mm:ss')}`;
    }

    render() {
        const {startTime, currentTime} = this.props;

        if (!startTime) {
            return this._renderStarting();
        }

        const uptime = moment.duration(currentTime.diff(startTime));

        return (
            <div>
                <pre>
                    Test started: {this._renderTime(startTime)}<br/>
                    Current time: {this._renderTime(currentTime)}
                </pre>

                <pre>Uptime: {uptime.humanize()}</pre>

                <pre>
                    Status: {HeartbeatService.status}
                    {
                        HeartbeatService.error && (
                            <>
                                <br/>Error: {HeartbeatService.error.message}
                            </>
                        )
                    }
                </pre>


            </div>
        );
    }

}
