/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert
, Button
, FormGroup
, Jumbotron
} from 'react-bootstrap';

import Ajax from './ajax';
import Form from './form';

class RegForm extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      fullname: ''
    , costume: ''
    , message: ''
    };
  }

  onChangeFullname(e) {
    this.setState({ fullname: e.target.value });
  }

  onChangeCostume(e) {
    this.setState({ costume: e.target.value });
  }

  onChangeMessage(e) {
    this.setState({ message: e.target.value });
  }

  isReadyToCheckIn() {
    return this.state.fullname.length && this.state.costume.length
  }

  onCheckIn(e) {
    const me = this;

    e.preventDefault();

    Ajax.post(`${document.baseURI}api/participant`, {
      fullname: me.state.fullname
    , costume: me.state.costume
    , message: me.state.message
    })
    .done(me.props.done);
  }

  render() {
    const controls = {
            fullname: {
              label: 'Fullname'
            , placeholder: 'First Last'
            , required: true
            , onChange: this.onChangeFullname.bind(this)
            }
          , costume: {
              label: 'Costume'
            , placeholder: 'What are you?'
            , required: true
            , onChange: this.onChangeCostume.bind(this)
            }
          , message: {
              label: 'Appeal to the Judges'
            , placeholder: 'Speak up yourself and your costume!'
            , onChange: this.onChangeMessage.bind(this)
            }
          }
        , disabled = !this.isReadyToCheckIn()
        , onCheckIn = this.onCheckIn.bind(this);

    return (
      <div id='register-form'>
        <Form.Input control={controls.fullname} />
        <Form.Input control={controls.costume} />
        <Form.Input control={controls.message} />
        <FormGroup className='check-in'>
          <Button bsStyle='warning' children='CHECK-IN'
                     disabled={disabled} onClick={onCheckIn} />
        </FormGroup>
      </div>
    );
  }
};

RegForm.propTypes = {
  // 完了時のコールバック関数
  done: PropTypes.func.isRequired
};


class RegDone extends React.Component
{
  render() {
    return (
      <div id='register-done'>
        <h3>Hi {this.props.fullname},<br />
        PLEASE KEEP THIS NUMBER:</h3>
        <div className='entry-number'>{this.props.id}</div>
        <Alert bsStyle='danger'>
          <strong>The contest will begin at 2:30pm here at the Rock Garden.</strong>
        </Alert>
        <Button bsStyle='warning' children='O K' onClick={this.props.done} />
      </div>
    );
  }
};

RegDone.propTypes = {
  // エントリー番号
  id: PropTypes.string.isRequired
  // 氏名
, fullname: PropTypes.string.isRequired
  // 完了時のコールバック関数
, done: PropTypes.func.isRequired
};


const InitData = {
  id: null
, fullname: ''
};

class RegPage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = InitData;
  }

  onComplete(res) {
    this.setState({
      id: res.id
    , fullname: res.fullname
    });
  }

  onReset() {
    this.setState(InitData);
  }

  render() {
    const onComplete = this.onComplete.bind(this)
        , onReset = this.onReset.bind(this)
        , body = this.state.id === null ?
                 <RegForm done={onComplete} /> :
                 <RegDone done={onReset} {...this.state} />;

    return (
      <div className='container'>
        <Jumbotron>
          <div className='title'>
            <h2>{document.title}</h2>
            <h1>REGISTRATION</h1>
          </div>
          {body}
        </Jumbotron>
      </div>
    );
  }
};

module.exports = RegPage;
