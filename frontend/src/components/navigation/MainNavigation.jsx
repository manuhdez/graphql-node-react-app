import React from 'react'
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const mainNavigation = props => {
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {props.auth === null ? <li><NavLink to="/auth">Login</NavLink></li> : <li><NavLink to="/logout">Logout</NavLink></li>}
          <li><NavLink to="/events">Events</NavLink></li>
          {props.auth !== null ? <li><NavLink to="/bookings">Bookings</NavLink></li> : null}
        </ul>
      </nav>
    </header>
  );
};

export default mainNavigation;