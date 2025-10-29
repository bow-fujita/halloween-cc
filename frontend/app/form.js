/**
 * Copyright (C) 2018-2025 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {
  ControlLabel
, FormControl
, FormGroup
} from 'react-bootstrap';


class RequiredFlag extends React.Component
{
  render() {
    return this.props.required ?
           <span className='required' children='*' /> : null;
  }
};

RequiredFlag.propTypes = {
  required: PropTypes.bool
};


class InputForm extends React.Component
{
  render() {
    let label = null;

    if (this.props.control.label) {
      label = (
        <ControlLabel>
        {this.props.control.label}
        <RequiredFlag required={this.props.required} />
        </ControlLabel>
      );
    }

    return (
      <FormGroup {...this.props.group}>
        {label}
        <FormControl {...this.props.control} />
      </FormGroup>
    );
  }
};

InputForm.propTypes = {
  // 必須項目か否か
  required: PropTypes.bool
  // FormGroupのプロパティ
, grouop: PropTypes.object
  // FormControlのプロパティ
, control: PropTypes.object
};


export default {
  Input: InputForm
};
