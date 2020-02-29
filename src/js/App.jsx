import React from 'react';
import moment from 'moment';

import {UptimeDisplay} from './components/UptimeDisplay.jsx';
import {TimerService} from './services';

export class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            startTime: moment()
        };
    }

    componentDidMount() {
        TimerService.start();
    }

    componentWillUnmount() {
        TimerService.stop();
    }

    render() {
        const {startTime} = this.state;

        return (
            <UptimeDisplay startTime={startTime}/>
        );
    }

}
