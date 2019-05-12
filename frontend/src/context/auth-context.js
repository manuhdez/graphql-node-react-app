import React from 'react';

export default React.createContext({
  userId: null,
  token: null,
  tokenExp: null,
  login: (userId, token, tokenExp) => {},
  logout: () => {}
});