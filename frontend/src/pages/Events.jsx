import React, {Component} from 'react';

import Modal from '../components/modal/modal';
import Backdrop from '../components/backdrop/backdrop';

import './Events.css';
import authContext from '../context/auth-context';

class EventsPage extends Component {
    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceRef = React.createRef();
        this.dateRef = React.createRef();
        this.descriptionRef = React.createRef();

        this.state = {
            events: [],
            creating: false,
        };
    }

    static contextType = authContext;

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents = () => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id,
                        title
                        date
                        price
                        description
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }

        // Send request to the server
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error(res.errors);
            }
            return res.json();
        })
        .then(data => {
            this.setState({events: data.data.events});
        })
        .catch(error => console.log(error));
    }

    startCreateEvent = () => {
        this.setState({creating: true});
    };

    modalCancelHandler = () => {
        this.setState({creating: false});
    };

    modalConfirmHandler = () => {
        this.setState({creating: false});
        const title = this.titleElRef.current.value;
        const price = parseFloat(this.priceRef.current.value);
        const date = this.dateRef.current.value;
        const description = this.descriptionRef.current.value;
        
        if (title.trim().length === 0 ||
            price === '' ||
            date.trim().length === 0 ||
            description.trim().length === 0) {
            return;
        }

        // Send the new event to the server
        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: { title: "${title}", price: ${price}, date: "${date}", description: "${description}" }) {
                        _id,
                        title
                        date
                        price
                        description
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }

        // Send request to the server
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.token}`
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error(res.errors);
            }
            return res.json();
        })
        .then(data => {
            this.fetchEvents();
        })
        .catch(error => console.log(error));
    };


    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && (
                    <Modal
                        title="Add new event"
                        canCancel={true}
                        canSave={true}
                        onCancel={this.modalCancelHandler}
                        onSave={this.modalConfirmHandler}
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="date" id="date" ref={this.dateRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionRef} ></textarea>
                            </div>
                        </form>
                    </Modal>
                )}

                {this.context.token && (
                    <div className="events-control">
                        <p>Share your events!</p>
                        <button className="btn" onClick={this.startCreateEvent}>Create Event</button>
                    </div>
                )}

                <ul className="events__list">
                    {this.state.events.map(event => (
                        <li key={event._id} className="events__list-item">
                            {event.title}
                        </li>
                    ))}
                </ul>
            </React.Fragment>
        );
    };
}

export default EventsPage;