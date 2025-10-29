/**
 * Copyright (C) 2018-2025 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Header from './header';
import Table from './table';
import Ajax from './ajax';


class ResultRow extends React.Component
{
  render() {
    const data = this.props.data;
    return (
      <tr>
        <td>{data.rank}</td>
        <td>{data.prize.item} by {data.prize.sponsor}</td>
        <td>{data.score}</td>
        <td>{data.id}</td>
        <td>{data.fullname}</td>
        <td>{data.costume}</td>
      </tr>
    );
  }
};

ResultRow.propTypes = {
  data: PropTypes.object.isRequired
};


class ResultTable extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { results: [] };
  }

  componentDidMount() {
    const me = this;
    Ajax.getJSON(`${document.baseURI}api/participant?rank`)
    .done((participants) => {
      Ajax.getJSON(`${document.baseURI}api/prize`)
      .done((prizes) => {
        let rank = 1
          , results = [];

        participants.forEach((participant) => {
          if (prizes.length) {
            participant.rank = rank++;
            participant.prize = _.pick(prizes[0], [ 'sponsor', 'item' ]);
            results.push(participant);
            if (!--prizes[0].quantity) {
              prizes.shift();
            }
          }
        });

        this.setState({ results: results });
      });
    });
  }

  render() {
    const thead = (
            <tr>
              <th className='col-xs-1'>Rank</th>
              <th className='col-xs-2'>Prize</th>
              <th className='col-xs-1'>Score</th>
              <th className='col-xs-1'>#</th>
              <th className='col-xs-2'>Name</th>
              <th className='col-xs-2'>Costume</th>
            </tr>
          )
        , tbody = this.state.results.map((result) => {
            return <ResultRow key={result.id} data={result} />;
          });

    return <Table thead={thead} tbody={tbody} />;
  }
};


class ResultPage extends React.Component
{
  render() {
    return (
      <div className='container'>
        <Header title='Result' />
        <ResultTable />
      </div>
    );
  }
};

export default ResultPage;
