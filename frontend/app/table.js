/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

class BootstrapTable extends React.Component
{
  render() {
    return (
      <Table responsive striped>
        <thead children={this.props.thead} />
        <tbody children={this.props.tbody} />
      </Table>
    );
  }
};

BootstrapTable.propTypes = {
  thead: PropTypes.element.isRequired
, tbody: PropTypes.arrayOf(PropTypes.element)
};

module.exports = BootstrapTable;
