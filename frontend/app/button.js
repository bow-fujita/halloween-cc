/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import {
  Button
, Glyphicon
} from 'react-bootstrap';


class GlyphiconButton extends React.Component
{
  render() {
    const props = _.omit(this.props, 'glyph');
    return (
      <Button {...props}>
        <Glyphicon glyph={this.props.glyph} />
      </Button>
    );
  }
};

GlyphiconButton.propTypes = {
  // Glyphの名前
  // 利用可能なGlyphの一覧：http://getbootstrap.com/components/
  glyph: PropTypes.string.isRequired

  // その他react-bootstrap::ButtonのPropsが利用可能
};


class RefreshButton extends React.Component
{
  render() {
    return <GlyphiconButton title='Refresh' {...this.props} glyph='refresh' />;
  }
};

class NewButton extends React.Component
{
  render() {
    return <GlyphiconButton title='New' {...this.props} glyph='plus' />;
  }
};

class EditButton extends React.Component
{
  render() {
    return <GlyphiconButton title='Edit' {...this.props} glyph='pencil' />;
  }
};

class DeleteButton extends React.Component
{
  render() {
    return <GlyphiconButton title='Delete' {...this.props} glyph='trash' />;
  }
};

class OkButton extends React.Component
{
  render() {
    return <GlyphiconButton title='OK'  {...this.props} glyph='ok' />;
  }
};

class CancelButton extends React.Component
{
  render() {
    return <GlyphiconButton title='Cancel' {...this.props} glyph='remove' />;
  }
};

class PrevButton extends React.Component
{
  render() {
    return <GlyphiconButton title='Prev' {...this.props} glyph='chevron-left' />;
  }
};

class NextButton extends React.Component
{
  render() {
    return <GlyphiconButton title='Next' {...this.props} glyph='chevron-right' />;
  }
};

class ListButton extends React.Component
{
  render() {
    return <GlyphiconButton title='List' {...this.props} glyph='list' />;
  }
};


module.exports = {
  Glyphicon: GlyphiconButton
, Refresh: RefreshButton
, New: NewButton
, Edit: EditButton
, Delete: DeleteButton
, Ok: OkButton
, Cancel: CancelButton
, Prev: PrevButton
, Next: NextButton
, List: ListButton
};
