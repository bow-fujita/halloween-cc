/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import {
  Button
, ButtonGroup
} from 'react-bootstrap';


import Header from './header';
import Table from './table';
import Ajax from './ajax';
import Notify from './notify';
import MyButton from './button';


class ScoreRow extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { score: 0 };
  }

  onClickScore(score) {
    this.setState({ score: score });
    this.props.onClickScore(this.props.judge.id, score);
  }

  render() {
    const me = this
        , currentScore = me.state.score
        , buttons = [1,2,3,4,5].map((score) => {
            let props = {
                  key: score
                , children: score
                , onClick: me.onClickScore.bind(me, score)
                }

            if (me.state.score == score) {
              props.bsStyle = 'primary';
            }

            return <Button {...props} />;
          });

    return (
      <tr>
        <td>{this.props.judge.name}</td>
        <td><ButtonGroup>{buttons}</ButtonGroup></td>
      </tr>
    );
  }
};

ScoreRow.propTypes = {
  judge: PropTypes.object.isRequired
, onClickScore: PropTypes.func.isRequired
};


class ScoreTable extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { results: [] };
  }

  getTotal() {
    return _.reduce(this.state.results, (score, result) => {
      return score + result.score;
    }, 0)
  }

  onClickScore(judge, score) {
    let results = this.state.results;
    if (!results.length) {
      results = this.props.judges.map((judge) => {
                  return {
                    judge: judge.id
                  , score: 0
                  };
                });
    }

    this.setState({
      results: results.map((result) => {
                 if (result.judge == judge) {
                   result.score = score;
                 }
                 return result;
               })
    });
  }

  onSubmit() {
    const me = this;
    Ajax.post(
      `${document.baseURI}api/participant/score/${this.props.participant}`
    , { score: this.getTotal() }
    )
    .done(() => {
      Notify.Info('Score is successfully updated!');
    });
  }

  render() {
    const onClickScore = this.onClickScore.bind(this)
        , total = this.getTotal()
        , thead = (
            <tr>
              <th className='col-xs-9'>Judge</th>
              <th className='col-xs-3'>
                Total: {total}&nbsp;
                <MyButton.Ok disabled={!total}
                             onClick={this.onSubmit.bind(this)} />
              </th>
            </tr>
          )
        , tbody = this.props.judges.map((judge) => {
            return (
              <ScoreRow key={judge.id}
                        judge={judge}
                        onClickScore={onClickScore} />
            );
          });

    return <Table thead={thead} tbody={tbody} />;
  }
};

ScoreTable.propTypes = {
  participant: PropTypes.string.isRequired
, judges: PropTypes.arrayOf(PropTypes.object).isRequired
};


class ScorePage extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      judges: []
    , participant: {}
    };
  }

  componentDidMount() {
    const me = this;
    Ajax.getJSON(`${document.baseURI}api/judge`)
    .done((data) => me.setState({ judges: data }));
    Ajax.getJSON(`${document.baseURI}api/participant/${me.props.participant}`)
    .done((data) => me.setState({ participant: data }));
  }

  render() {
    const data = this.state.participant
        , title=`#${data.id} - ${data.fullname} (${data.costume})`
        , message = data.message || '-'
        , buttons = [(
            <MyButton.Prev key='prev'
                           disabled={!data.prev}
                           href={`${document.baseURI}score/${data.prev}`} />
          ), (
            <MyButton.List key='list'
                           href={`${document.baseURI}participants`} />
          ), (
            <MyButton.Next key='next'
                           disabled={!data.next}
                           href={`${document.baseURI}score/${data.next}`} />
          )];


    return (
      <div className='container'>
        <Header title={title} buttons={buttons} />
        <p><strong>Message:</strong> {message}</p>
        <ScoreTable participant={this.props.participant} judges={this.state.judges} />
      </div>
    );
  }
};

ScorePage.propTypes = {
  participant: PropTypes.string.isRequired
};

module.exports = ScorePage;
