/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const utils = require('../utils');

describe('lib', () => {
  before(utils.setup);

  describe('apperr', () => {
    const AppError = global.lib('apperr');

    it('construct w/o extra', () => {
      const err = new AppError('Application error');
      err.should.be.an.instanceof(Error);
      err.name.should.be.equal('AppError');
      err.message.should.be.equal('Application error');
    });

    it('construct w/ extra as String', () => {
      const err = new AppError('Application error', 'CustomError');
      err.should.be.an.instanceof(Error);
      err.name.should.be.equal('CustomError');
      err.message.should.be.equal('Application error');
    });

    it('construct w/ extra as Object', () => {
      const extra = {
            name: 'CustomError'
          , file: __filename
          , message: 'Forbidden' // message cannot be overwritten
          }
          , err = new AppError('Application error', extra)
      ;
      err.should.be.an.instanceof(Error);
      err.name.should.be.equal('CustomError');
      err.file.should.be.equal(__filename);
      err.message.should.be.equal('Application error');
    });
  }); // apperr

  describe('httperr', () => {
    const httperr = global.lib('httperr')
        , AppError = global.lib('apperr')
    ;

    it('status as Error', () => {
      const err = httperr(new Error('Application error'));
      err.should.be.an.instanceof(Error);
      err.status.should.be.equal(500);
      err.message.should.be.equal('Application error');
    });

    it('status as neither Number nor String', () => {
      (() => { httperr([]) }).should.throw('Invalid argument');
    });

    it('status as Number w/o message', () => {
      const err = httperr(403);
      err.should.be.an.instanceof(AppError);
      err.status.should.be.equal(403);
      err.message.should.be.equal('Forbidden');
      err.name.should.be.equal('AppError');
    });

    it('status as Number w/ message', () => {
      const err = httperr(403, 'No permission');
      err.should.be.an.instanceof(AppError);
      err.status.should.be.equal(403);
      err.message.should.be.equal('No permission');
      err.name.should.be.equal('AppError');
    });

    it('status as Number w/ message and extra', () => {
      const err = httperr(403, 'No permission', 'PermissionError');
      err.should.be.an.instanceof(AppError);
      err.status.should.be.equal(403);
      err.message.should.be.equal('No permission');
      err.name.should.be.equal('PermissionError');
    });

    it('status as Number w/ message as AppError', () => {
      const err = httperr(403, new AppError('No permission', 'PermissionError'));
      err.should.be.an.instanceof(AppError);
      err.status.should.be.equal(403);
      err.message.should.be.equal('No permission');
      err.name.should.be.equal('PermissionError');
    });

    it('status as String', () => {
      const err = httperr('Application error');
      err.should.be.an.instanceof(AppError);
      err.status.should.be.equal(500);
      err.message.should.be.equal('Application error');
      err.name.should.be.equal('AppError');
    });

    it('status as String w/ extra ', () => {
      const err = httperr('Application error', 'DatabaseError');
      err.should.be.an.instanceof(AppError);
      err.status.should.be.equal(500);
      err.message.should.be.equal('Application error');
      err.name.should.be.equal('DatabaseError');
    });
  }); // httperr
});
