/**
 * Copyright (C) 2018-2025 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {
  Col
, Grid
, Row
} from 'react-bootstrap';

class Header extends React.Component
{
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={10}>
            <h2>{this.props.title}</h2>
          </Col>
          <Col xs={2} className='header-buttons'>
            {this.props.buttons}
          </Col>
        </Row>
      </Grid>
    );
  }
};

Header.propTypes = {
  title: PropTypes.string.isRequired
, buttons: PropTypes.arrayOf(PropTypes.element)
};

export default Header;
