import React, { Component } from 'react';

import Modal from '../components/modal/modal';
import Backdrop from '../components/backdrop/backdrop';
import EventsList from '../components/eventsList/eventsList';
import Spinner from '../components/spinner/spinner';

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
      loading: false,
      selectedEvent: null
    };
  }

  static contextType = authContext;
  static isActive = false;

  componentDidMount() {
    this.fetchEvents();
    this.isActive = true;
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  fetchEvents = () => {
    this.setState({ loading: true });

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
    };

    // Send request to the server
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res.errors);
        }
        return res.json();
      })
      .then((data) => {
        console.log('la respuesta de eventos llego con exito');
        if (this.isActive) {
          this.setState({ events: data.data.events, loading: false });
        }
      })
      .catch((error) => {
        if (this.isActive) {
          this.setState({ loading: false });
        }
      });
  };

  startCreateEvent = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = parseFloat(this.priceRef.current.value);
    const date = this.dateRef.current.value;
    const description = this.descriptionRef.current.value;

    if (
      title.trim().length === 0 ||
      price === '' ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
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
                    }
                }
            `
    };

    // Send request to the server
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res.errors);
        }
        return res.json();
      })
      .then((data) => {
        this.setState((prevState) => {
          const {
            _id,
            title,
            description,
            date,
            price
          } = data.data.createEvent;

          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id,
            title,
            price,
            description,
            date,
            creator: { _id: this.context.token }
          });

          return {
            events: updatedEvents
          };
        });
      })
      .catch((error) => console.log(error));
  };

  handleViewDetail = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = this.state.events.find(
        (event) => event._id === eventId
      );

      return { selectedEvent };
    });
  };

  /**
   * Handles the logic to book an event from an auth user
   */
  handleBookEvent = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }

    const requestBody = {
      query: `
            mutation {
                bookEvent(eventId: "${this.state.selectedEvent._id}") {
                    _id
                    createdAt
                    updatedAt
                }
            }
          `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res.errors);
        }
        return res.json();
      })
      .then((res) => {
        console.log(res.data);
        this.setState({ selectedEvent: null });
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title="Add new event"
              canCancel={true}
              canSave={true}
              onCancel={this.modalCancelHandler}
              onSave={this.modalConfirmHandler}
              confirmText="Save"
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
                  <textarea
                    id="description"
                    rows="4"
                    ref={this.descriptionRef}
                  />
                </div>
              </form>
            </Modal>
          </React.Fragment>
        )}

        {this.state.selectedEvent && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title={this.state.selectedEvent.title}
              canCancel
              canSave={this.context.token ? true : false}
              onCancel={this.modalCancelHandler}
              onSave={this.handleBookEvent}
              confirmText="Book"
            >
              <h2>
                ${this.state.selectedEvent.price} -{' '}
                {new Date(this.state.selectedEvent.date).toLocaleDateString()}
              </h2>
              <p>{this.state.selectedEvent.description}</p>
            </Modal>
          </React.Fragment>
        )}

        {this.context.token && (
          <div className="events-control">
            <p>Share your events!</p>
            <button className="btn" onClick={this.startCreateEvent}>
              Create Event
            </button>
          </div>
        )}

        {this.state.loading ? (
          <Spinner />
        ) : (
          <EventsList
            events={this.state.events}
            currentUser={this.context.userId}
            onViewDetail={this.handleViewDetail}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
