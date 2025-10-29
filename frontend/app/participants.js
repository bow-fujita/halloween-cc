/**
 * Copyright (C) 2018-2025 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Button from 'react-bootstrap/lib/Button';
import {
  FaSync
, FaThumbsUp
, FaTrash
} from 'react-icons/fa';

import Header from './header';
import Table from './table';
import Ajax from './ajax';


class ParticipantRow extends React.Component
{
  onClickDelete() {
    const data = this.props.data;
    if (confirm(`Are you sure to delete ${data.fullname}?`)) {
      const onDelete = this.props.onDelete;

      Ajax({
        method: 'DELETE'
      , url: `${document.baseURI}api/participant/${data.id}`
      })
      .done(() => onDelete(data.id));
    }
  }

  render() {
    const data = this.props.data
        , onClickScore = () => location.href = `${document.baseURI}score/${data.id}`
        , score = data.score ||
                  <Button children={<FaThumbsUp />} onClick={onClickScore} />;

    return (
      <tr>
        <td>{data.id}</td>
        <td>{data.fullname}</td>
        <td>{data.costume}</td>
        <td>{data.message}</td>
        <td className='text-right'>{score}</td>
        <td className='text-right'>
          <Button children={<FaTrash />}
                  onClick={this.onClickDelete.bind(this)} />
        </td>
      </tr>
    );
  }
};

ParticipantRow.propTypes = {
  data: PropTypes.object.isRequired
, onDelete: PropTypes.func.isRequired
};


class ParticipantsTable extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      participants: []
    };
  }

  loadAll() {
    const me = this;
    Ajax.getJSON(`${document.baseURI}api/participant`)
    .done((data) => me.setState({ participants: data }));
  }

  componentDidMount() {
    this.loadAll();
  }

  onDeleteRow(id) {
    this.setState({
      participants: _.reject(
                      this.state.participants
                    , (participant) => participant.id == id)
    });
  }

  render() {
    const me = this
        , thead = (
            <tr>
              <th className='col-xs-1'>#</th>
              <th className='col-xs-3'>Name</th>
              <th className='col-xs-3'>Costume</th>
              <th className='col-xs-3'>Message</th>
              <th className='col-xs-1 text-right'>Score</th>
              <th className='col-xs-1 text-right'>
                <Button children={<FaSync />}
                        onClick={me.loadAll.bind(me)} />
              </th>
            </tr>
          )
        , tbody = me.state.participants.map((participant) => {
            return (
              <ParticipantRow key={participant.id}
                              data={participant}
                              onDelete={me.onDeleteRow.bind(me)} />
            );
          });

    return <Table thead={thead} tbody={tbody} />;
  }

};

class ParticipantsPage extends React.Component
{
  render() {
    return (
      <div className='container'>
        <Header title='Participants' />
        <ParticipantsTable />
      </div>
    );
  }
};

export default ParticipantsPage;
