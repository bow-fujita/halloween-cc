/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Header from './header';
import Button from './button';
import Form from './form';
import Table from './table';
import Ajax from './ajax';


class JudgeRow extends React.Component
{
  onClickDelete() {
    const data = this.props.data;
    if (confirm(`Are you sure to delete ${data.name}?`)) {
      const onDelete = this.props.onDelete;

      Ajax({
        method: 'DELETE'
      , url: `${document.baseURI}api/judge/${data.id}`
      })
      .done(() => onDelete(data.id));
    }
  }

  render() {
    const onClickDelete = this.onClickDelete.bind(this);
    return (
      <tr>
        <td>{this.props.data.name}</td>
        <td className='text-right'>
          <Button.Delete onClick={onClickDelete} />
        </td>
      </tr>
    );
  }
};

JudgeRow.propTypes = {
  data: PropTypes.object.isRequired
, onDelete: PropTypes.func.isRequired
};


class JudgeNewRow extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  onChangeName(e) {
    this.setState({ name: e.target.value });
  }

  onOk() {
    const me = this;
    Ajax.post(`${document.baseURI}api/judge`, { name: this.state.name })
    .done(me.props.onClose);
  }

  onCancel() {
    this.props.onClose();
  }

  render() {
    const control = {
            placeholder: 'Name'
          , required: true
          , onChange: this.onChangeName.bind(this)
          };

    return (
      <tr>
        <td>
          <Form.Input control={control} />
        </td>
        <td className='text-right'>
          <Button.Ok bsStyle='success'
                     disabled={!this.state.name.length}
                     onClick={this.onOk.bind(this)}
          />
          <Button.Cancel onClick={this.onCancel.bind(this)} />
        </td>
      </tr>
    );
  }
};

JudgeNewRow.propTypes = {
  onClose: PropTypes.func.isRequired
};


class JudgesTable extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      judges: []
    , newOpened: false
    };
  }

  componentDidMount() {
    const me = this;
    Ajax.getJSON(`${document.baseURI}api/judge`)
    .done((data) => me.setState({ judges: data }));
  }

  onOpenNewRow() {
    this.setState({ newOpened: true });
  }

  onCloseNewRow(judge) {
    let newState = { newOpened: false };

    if (judge) {
      newState.judges = this.state.judges.concat(judge);
    }
    this.setState(newState);
  }

  onDeleteRow(id) {
    this.setState({
      judges: _.reject(this.state.judges, (judge) => judge.id == id)
    });
  }

  render() {
    const me = this
        , thead = (
            <tr>
              <th className='col-xs-10'>Name</th>
              <th className='col-xs-2 text-right'>
                <Button.New onClick={me.onOpenNewRow.bind(me)} />
              </th>
            </tr>
          )
        , tbody = me.state.judges.map((judge) => {
            return (
              <JudgeRow key={judge.id}
                        data={judge}
                        onDelete={me.onDeleteRow.bind(me)} />
            );
          });

    if (me.state.newOpened) {
      tbody.push(<JudgeNewRow key={0} onClose={me.onCloseNewRow.bind(me)} />);
    }

    return <Table thead={thead} tbody={tbody} />;
  }
};


class JudgesPage extends React.Component
{
  render() {
    return (
      <div className='container'>
        <Header title='Judges' />
        <JudgesTable />
      </div>
    );
  }
};

module.exports = JudgesPage;
