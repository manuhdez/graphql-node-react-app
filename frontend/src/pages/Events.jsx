import React, {Component} from 'react';

import Modal from '../components/modal/modal';
import Backdrop from '../components/backdrop/backdrop';

import './Events.css';

class EventsPage extends Component {
    state = {
        creating: false,
    };

    startCreateEvent = () => {
        this.setState({creating: true});
    };

    modalConfirmHandler = () => {
        this.setState({creating: false});
    };

    modalCancelHandler = () => {
        this.setState({creating: false});
    };

    modalElement = (
        <React.Fragment>
            <Backdrop />
            <Modal
                title="Add new event"
                canCancel={true}
                canSave={true}
                onCancel={this.modalCancelHandler}
                onSave={this.modalConfirmHandler}
            >
                <p>Modal content</p>
            </Modal>
        </React.Fragment>
    );

    render() {
        return (
            <React.Fragment>
                {this.state.creating && this.modalElement}
                <div className="events-control">
                    <p>Share your events!</p>
                    <button className="btn" onClick={this.startCreateEvent}>Create Event</button>
                </div>
            </React.Fragment>
        );
    };
}

export default EventsPage;