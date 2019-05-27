import React from 'react'

import './spinner.css';

const spinner = () => (
  <div className="spinner__container">
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default spinner;