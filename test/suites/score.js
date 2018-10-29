/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const utils = require('../utils');

describe('score', () => {
  let participant1 = {
        fullname: 'Participant One'
      , costume: 'Costume One'
      , message: 'Trick or treat'
      }
    , participant2 = {
        fullname: 'Participant Two'
      , costume: 'Costume Two'
      , message: 'Trick or treat'
      }
    , participant3 = {
        fullname: 'Participant Three'
      , costume: 'Costume Three'
      , message: 'Trick or treat'
      };

  before((done) => {
    utils.setup((err) => {
      if (err) {
        return done(err);
      }

      utils.expect.json(
        utils.request.api
        .get('/participant')
      , (json) => {
          json.should.be.an.Array;
          json.should.be.empty();
        }
      )
      .then(() => {
        return Promise.all(
          [ participant1, participant2, participant3 ]
          .map((participant) => {
            return utils.expect.json(
              utils.request.api
              .post('/participant')
              .send(participant)
            );
          })
        );
      })
      .then(() => {
        return utils.expect.json(
          utils.request.api
          .get('/participant')
        , (json) => {
            json.should.be.an.Array;
            json.should.have.length(3);
            json[0].should.have.properties(participant1);
            json[1].should.have.properties(participant2);
            json[2].should.have.properties(participant3);
          }
        )
      })
      .then(done, done);
    });
  }); // before

  describe('html', () => {
    it('not found', (done) => {
      utils.expect.html(
        utils.request.html.get('/score', false)
      , 404
      )
      .then(done, done);
    });

    it('render', (done) => {
      utils.expect.html(
        utils.request.html.get('/score/1', false)
      , ($) => {
          $('body#score-page').length.should.be.equal(1);
          $('div#score-mount').length.should.be.equal(1);
          $('div#score-mount').text().should.be.equal('1');
        }
      )
      .then(done, done);
    });
  }); // html
});
