import React from 'react';

import './modal.css';

const modal = (props) => (
  <div className="modal">
    <header className="modal__header">
      <h1>{props.title}</h1>
    </header>
    <section className="modal__content">{props.children}</section>
    <section className="modal__actions">
      {props.canCancel && (
        <button className="btn" onClick={props.onCancel}>
          Cancel
        </button>
      )}
      {props.canSave && (
        <button className="btn" onClick={props.onSave}>
          {props.confirmText}
        </button>
      )}
    </section>
  </div>
);

export default modal;
