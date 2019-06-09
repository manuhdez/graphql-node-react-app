import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/spinner/spinner';
import BookingsList from '../components/bookings/bookingList/bookingList';

class BookingsPage extends Component {
  state = {
    loading: false,
    bookings: []
  };

  static contextType = AuthContext;
  static isActive = false;

  componentDidMount() {
    this.fetchBookings();
    this.isActive = true;
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  fetchBookings = () => {
    this.setState({ loading: true });

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            updatedAt
            user {
              _id
              email
            }
            event {
              _id
              title
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
        const { bookings } = data.data;
        this.setState({ bookings: bookings, loading: false });
      })
      .catch((error) => this.setState({ loading: false }));
  };

  handleCancelBooking = (bookingId) => {
    this.setState({ loading: true });

    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
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
        if (this.isActive) {
          const updatedBookingsList = this.state.bookings.filter(
            (booking) => booking._id !== bookingId
          );
          this.setState({ bookings: updatedBookingsList, loading: false });
        }
      })
      .catch((error) => {
        if (this.isActive) {
          this.setState({ loading: false });
        }
      });
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <h1>Bookings page</h1>
            <BookingsList
              bookings={this.state.bookings}
              onCancelBooking={this.handleCancelBooking}
            />
          </React.Fragment>
        )}
      </>
    );
  }
}

export default BookingsPage;
