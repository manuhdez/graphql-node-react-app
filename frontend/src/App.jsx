import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthContext from './context/auth-context';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

import MainNavigation from './components/navigation/MainNavigation';

import './App.css';

class App extends Component {
  state = {
    userId: null,
    token: null,
    tokenExp: null
  }

  login = (userId, token, tokenExp) => {
    this.setState({userId, token, tokenExp});
  };

  logout = () => {
    this.setState({userId: null, token: null, tokenExp: null});
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{ userId: this.state.userId, token: this.state.token, tokenExp: this.state.tokenExp, login: this.login, logout: this.logout }}>
          <MainNavigation auth={this.state.token ? true : false}/>
          <main className="main-content">
            <Switch>
              {this.state.token ? <Redirect from="/" to="/events" exact /> : null}
              {this.state.token ? <Redirect from="/auth" to="/events" exact /> : null}
              {!this.state.token ? <Route path="/auth" component={AuthPage} /> : null}
              <Route path="/events" component={EventsPage} />
              {this.state.token ? <Route path="/bookings" component={BookingsPage} /> : null}
              {!this.state.token ? <Redirect to="/auth" exact /> : null}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
