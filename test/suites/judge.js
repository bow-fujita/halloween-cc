/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const utils = require('../utils');

describe('judge', () => {
  before(utils.setup);

  it('html', (done) => {
    utils.expect.html(
      utils.request.html.get('/judges', false)
    , ($) => {
        $('body#judges-page').length.should.be.equal(1);
        $('div#judges-mount').length.should.be.equal(1);
      }
    )
    .then(done, done);
  });

  describe('api', () => {
    let judge1 = {
          name: 'Judge One'
        }
      , judge2 = {
          name: 'Judge Two'
        };

    describe('list', () => {
      it('empty', (done) => {
        utils.expect.json(
          utils.request.api
          .get('/judge')
        , (json) => {
            json.should.be.Array;
            json.should.be.empty();
          }
        )
        .then(done, done);
      });
    });

    describe('add', () => {
      it('undefined name', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .post('/judge')
        )
        .then(done, done);
      });

      it('empty name', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .post('/judge')
          .send({ name: '' })
        , 'Name'
        )
        .then(done, done);
      });

      it('judge1', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/judge')
          .send(judge1)
        )
        .then(() => {
          judge1.id = 1;

          return utils.expect.json(
            utils.request.api
            .get('/judge')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(1);
              json[0].should.have.properties(judge1);
            }
          );
        })
        .then(done, done);
      });

      it('judge2', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/judge')
          .send(judge2)
        )
        .then(() => {
          judge2.id = 2;

          return utils.expect.json(
            utils.request.api
            .get('/judge')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(2);
              json[0].should.have.properties(judge1);
              json[1].should.have.properties(judge2);
            }
          );
        })
        .then(done, done);
      });
    }); // add

    describe('remove', () => {
      it('not found', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/judge/999')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/judge')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(2);
              json[0].should.have.properties(judge1);
              json[1].should.have.properties(judge2);
            }
          );
        })
        .then(done, done);
      });

      it('judge1', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/judge/1')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/judge')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(1);
              json[0].should.have.properties(judge2);
            }
          );
        })
        .then(done, done);
      });

      it('judge2', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/judge/2')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/judge')
          , (json) => {
              json.should.be.Array;
              json.should.be.empty();
            }
          );
        })
        .then(done, done);
      });

    }); // remove

  }); // api
});
