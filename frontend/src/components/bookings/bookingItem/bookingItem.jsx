import React from 'react';

import './bookingItem.css';

const bookingItem = (props) => (
  <li className="bookings__item">
    <div className="bookings__item--data">
      {props.booking.event.title} -{' '}
      {new Date(props.booking.createdAt).toLocaleDateString()}
    </div>
    <div className="bookings__item--actions">
      <button className="btn" onClick={() => props.onCancel(props.booking._id)}>
        Cancel
      </button>
    </div>
  </li>
);

export default bookingItem;
