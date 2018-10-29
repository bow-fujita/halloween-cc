/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import 'gasparesganga-jquery-loading-overlay';

import 'bootstrap';
import 'bootstrap-notify';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

$(() => {
  $(document).ajaxStart(() => $.LoadingOverlay('show', { fade: 0 }));
  $(document).ajaxStop(()  => $.LoadingOverlay('hide', { fade: 0 }));

  const register = document.getElementById('register-mount');
  if (register) {
    ReactDOM.render(<App.Register />, register);
  }

  const participants = document.getElementById('participants-mount');
  if (participants) {
    ReactDOM.render(<App.Participants />, participants);
  }

  const judges = document.getElementById('judges-mount');
  if (judges) {
    ReactDOM.render(<App.Judges />, judges);
  }

  const prizes = document.getElementById('prizes-mount');
  if (prizes) {
    ReactDOM.render(<App.Prizes />, prizes);
  }

  const score = document.getElementById('score-mount');
  if (score) {
    ReactDOM.render(<App.Score participant={score.textContent} />, score);
  }

  const result = document.getElementById('result-mount');
  if (result) {
    ReactDOM.render(<App.Result />, result);
  }
});
