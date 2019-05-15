import React from 'react'
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

const mainNavigation = props => {
  return (
    <AuthContext.Consumer>
      {authContext => (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EasyEvent</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!authContext.token ?
                <li><NavLink to="/auth">Login</NavLink></li> :
                <li><a href="/" onClick={authContext.logout}>Logout</a></li>
              }
              <li><NavLink to="/events">Events</NavLink></li>
              {authContext.token ? <li><NavLink to="/bookings">Bookings</NavLink></li> : null}
            </ul>
          </nav>
        </header>
      )}
    </AuthContext.Consumer>
  );
};

export default mainNavigation;