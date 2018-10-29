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


class PrizeRow extends React.Component
{
  onClickEdit() {
    this.props.onEdit(this.props.data.id);
  }

  onClickDelete() {
    const data = this.props.data;
    if (confirm(`Are you sure to delete ${data.item} by ${data.sponsor}?`)) {
      const onDelete = this.props.onDelete;

      Ajax({
        method: 'DELETE'
      , url: `${baseURI}api/prize/${data.id}`
      })
      .done(() => onDelete(data.id));
    }
  }

  render() {
    const data = this.props.data
        , onClickEdit = this.onClickEdit.bind(this)
        , onClickDelete = this.onClickDelete.bind(this);

    return (
      <tr>
        <td>{data.sponsor}</td>
        <td>{data.item}</td>
        <td>{data.quantity}</td>
        <td className='text-right'>
          <Button.Edit onClick={onClickEdit} />
          <Button.Delete onClick={onClickDelete} />
        </td>
      </tr>
    );
  }
};

PrizeRow.propTypes = {
  data: PropTypes.object.isRequired
, onEdit: PropTypes.func.isRequired
, onDelete: PropTypes.func.isRequired
};


class PrizeEditRow extends React.Component
{
  constructor(props) {
    super(props);
    if (props.data) {
      this.state = {
        sponsor: props.data.sponsor
      , item: props.data.item
      , quantity: props.data.quantity
      };
    }
    else {
      this.state = {
        sponsor: ''
      , item: ''
      , quantity: 1
      };
    }
  }

  onChangeSponsor(e) {
    this.setState({ sponsor: e.target.value });
  }

  onChangeItem(e) {
    this.setState({ item: e.target.value });
  }

  onChangeQuantity(e) {
    this.setState({ quantity: e.target.value });
  }

  isFilled() {
    if (!this.state.sponsor.length || !this.state.item.length) {
      return false;
    }

    const quantity = parseInt(this.state.quantity);
    return !isNaN(quantity) && quantity > 0;
  }

  onOk() {
    const me = this;
    let newData = {
          sponsor: me.state.sponsor
        , item: me.state.item
        , quantity: parseInt(me.state.quantity)
        };

    if (!me.props.data) {
      Ajax.post(`${document.baseURI}api/prize`, newData)
      .done((row) => me.props.onClose(row, true));
    }
    else {
      const id = me.props.data.id;

      Ajax({
        method: 'PUT'
      , url: `${document.baseURI}api/prize/${id}`
      , data: newData
      })
      .done(() => {
        newData.id = id;
        me.props.onClose(newData);
      });
    }
  }

  onCancel() {
    this.props.onClose();
  }

  render() {
    const control = {
            sponsor: {
              placeholder: 'Sponsor'
            , required: true
            , value: this.state.sponsor
            , onChange: this.onChangeSponsor.bind(this)
            }
          , item: {
              placeholder: 'Item'
            , required: true
            , value: this.state.item
            , onChange: this.onChangeItem.bind(this)
            }
          , quantity: {
              placeholder: 'Quantity'
            , required: true
            , value: this.state.quantity
            , onChange: this.onChangeQuantity.bind(this)
            }
          }
        , disabled = !this.isFilled()

    return (
      <tr>
        <td><Form.Input control={control.sponsor} /></td>
        <td><Form.Input control={control.item} /></td>
        <td><Form.Input control={control.quantity} /></td>
        <td className='text-right'>
          <Button.Ok bsStyle='success'
                     disabled={disabled}
                     onClick={this.onOk.bind(this)}
          />
          <Button.Cancel onClick={this.onCancel.bind(this)} />
        </td>
      </tr>
    );
  }
};

PrizeEditRow.propTypes = {
  data: PropTypes.object
, onClose: PropTypes.func.isRequired
};



class PrizesTable extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      prizes: []
    , editor: null
    };
  }

  componentDidMount() {
    const me = this;
    Ajax.getJSON(`${document.baseURI}api/prize`)
    .done((data) => me.setState({ prizes: data }));
  }

  onOpenNewRow() {
    this.setState({ editor: 0 });
  }

  onEditRow(id) {
    this.setState({ editor: id });
  }

  onCloseEditRow(newPrize, isCreated) {
    let newState = { editor: null };

    if (newPrize) {
      if (isCreated) {
        newState.prizes = this.state.prizes.concat(newPrize);
      }
      else {
        newState.prizes = this.state.prizes.map((prize) => {
                            return prize.id == newPrize.id ? newPrize : prize;
                          });
      }
    }
    this.setState(newState);
  }

  onDeleteRow(id) {
    this.setState({
      prizes: _.reject(this.state.prizes, (prize) => prize.id == id)
    });
  }

  render() {
    const me = this
        , thead = (
            <tr>
              <th className='col-xs-4'>Sponsor</th>
              <th className='col-xs-4'>Item</th>
              <th className='col-xs-2'>Quantity</th>
              <th className='col-xs-2 text-right'>
                <Button.New onClick={me.onOpenNewRow.bind(me)} />
              </th>
            </tr>
          )
        , tbody = me.state.prizes.map((prize) => {
            if (prize.id == me.state.editor) {
              return (
                <PrizeEditRow key={prize.id}
                              data={prize}
                              onClose={me.onCloseEditRow.bind(me)} />
              );
            }

            return (
              <PrizeRow key={prize.id}
                        data={prize}
                        onEdit={me.onEditRow.bind(me)}
                        onDelete={me.onDeleteRow.bind(me)} />
            );
          });

    if (0 === me.state.editor) {
      tbody.push(
        <PrizeEditRow key={0}
                      data={null}
                      onClose={me.onCloseEditRow.bind(me)} />
      );
    }

    return <Table thead={thead} tbody={tbody} />;
  }
};


class PrizesPage extends React.Component
{
  render() {
    return (
      <div className='container'>
        <Header title='Prizes' />
        <PrizesTable />
      </div>
    );
  }
};

module.exports = PrizesPage;
