import React from 'react';
import BookingItem from '../bookingItem/bookingItem';

import './bookingsList.css';

const bookingsList = (props) => (
  <ul className="bookings__list">
    {props.bookings.map((booking) => (
      <BookingItem
        key={booking._id}
        booking={booking}
        onCancel={props.onCancelBooking}
      />
    ))}
  </ul>
);

export default bookingsList;
