import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/spinner/spinner';

class BookingsPage extends Component {
  state = {
    loading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
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

  render() {
    return (
      <>
        {this.state.loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <h1>Bookings page</h1>
            <ul>
              {this.state.bookings
                ? this.state.bookings.map((booking) => (
                    <li key={booking._id}>{booking.event.title}</li>
                  ))
                : null}
            </ul>
          </React.Fragment>
        )}
      </>
    );
  }
}

export default BookingsPage;
