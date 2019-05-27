import React from 'react';

import EventItem from './eventItem/eventItem';

import './eventsList.css';

const eventsList = (props) => (
  <ul className="events__list">
    {props.events.map((event) => (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        owner={event.creator}
        currentUser={props.currentUser}
        onDetail={props.onViewDetail}
      />
    ))}
  </ul>
);

export default eventsList;
