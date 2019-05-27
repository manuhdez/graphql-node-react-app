import React from 'react';

import './eventItem.css';

const eventItem = (props) => (
  <li key={props.eventId} className="events__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {props.currentUser !== props.owner._id ? (
        <React.Fragment>
          <button className="btn" onClick={() => props.onDetail(props.eventId)}>
            View Details
          </button>
          <p>{props.owner.email}</p>
        </React.Fragment>
      ) : (
        <div className="events__list--item__owner" />
      )}
    </div>
  </li>
);

export default eventItem;
