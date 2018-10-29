/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const utils = require('../utils')
    , should = require('should')
;

describe('participant', () => {
  before(utils.setup);

  describe('html', () => {
    it('register', (done) => {
      utils.expect.html(
        utils.request.html.get('/', false)
      , ($) => {
          $('body#register-page').length.should.be.equal(1);
          $('div#register-mount').length.should.be.equal(1);
        }
      )
      .then(done, done);
    });

    it('list', (done) => {
      utils.expect.html(
        utils.request.html.get('/participants', false)
      , ($) => {
          $('body#participants-page').length.should.be.equal(1);
          $('div#participants-mount').length.should.be.equal(1);
        }
      )
      .then(done, done);
    });

  }); // html

  describe('api', () => {
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

    describe('list', () => {
      it('empty', (done) => {
        utils.expect.json(
          utils.request.api
          .get('/participant')
        , (json) => {
            json.should.be.an.Array;
            json.should.be.empty();
          }
        )
        .then(done, done);
      });
    });

    describe('register', () => {
      it('undefined fullname', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .post('/participant')
          .send(utils.param.omit(participant1, 'fullname'))
        )
        .then(done, done);
      });

      it('undefined costume', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .post('/participant')
          .send(utils.param.omit(participant1, 'costume'))
        )
        .then(done, done);
      });

      it('undefined message', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .post('/participant')
          .send(utils.param.omit(participant1, 'message'))
        )
        .then(done, done);
      });

      it('empty fullname', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .post('/participant')
          .send(utils.param.overwrite(participant1, {
            fullname: ''
          }))
        , 'Fullname'
        )
        .then(done, done);
      });

      it('empty costume', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .post('/participant')
          .send(utils.param.overwrite(participant1, {
            costume: ''
          }))
        , 'Costume'
        )
        .then(done, done);
      });

      it('participant1', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/participant')
          .send(participant1)
        , (json) => {
            json.should.have.properties({
              id: 1
            , fullname: participant1.fullname
            });
            participant1.id = 1;
          }
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant')
          , (json) => {
              json.should.be.an.Array;
              json.should.have.length(1);
              json[0].should.have.properties(participant1);
            }
          );
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/1')
          , (json) => {
              json.should.have.properties(participant1);
              should(json.prev).be.null;
              should(json.next).be.null;
          });
        })
        .then(done, done);
      });

      it('participant2', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/participant')
          .send(participant2)
        , (json) => {
            json.should.have.properties({
              id: 2
            , fullname: participant2.fullname
            });
            participant2.id = 2;
          }
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant')
          , (json) => {
              json.should.be.an.Array;
              json.should.have.length(2);
              json[0].should.have.properties(participant1);
              json[1].should.have.properties(participant2);
            }
          );
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/1')
          , (json) => {
              json.should.have.properties(participant1);
              should(json.prev).be.null;
              json.next.should.be.equal(2);
          });
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/2')
          , (json) => {
              json.should.have.properties(participant2);
              json.prev.should.be.equal(1);
              should(json.next).be.null;
          });
        })
        .then(done, done);
      });

      it('participant3', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/participant')
          .send(participant3)
        , (json) => {
            json.should.have.properties({
              id: 3
            , fullname: participant3.fullname
            });
            participant3.id = 3;
          }
        )
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
          );
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/1')
          , (json) => {
              json.should.have.properties(participant1);
              should(json.prev).be.null;
              json.next.should.be.equal(2);
          });
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/2')
          , (json) => {
              json.should.have.properties(participant2);
              json.prev.should.be.equal(1);
              json.next.should.be.equal(3);
          });
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/3')
          , (json) => {
              json.should.have.properties(participant3);
              json.prev.should.be.equal(2);
              should(json.next).be.null;
          });
        })
        .then(done, done);
      });

    }); // register

    describe('remove', () => {
      it('not found', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/participant/999')
        )
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
          );
        })
        .then(done, done);
      });

      it('participant1', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/participant/1')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant')
          , (json) => {
              json.should.be.an.Array;
              json.should.have.length(2);
              json[0].should.have.properties(participant2);
              json[1].should.have.properties(participant3);
            }
          );
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/2')
          , (json) => {
              json.should.have.properties(participant2);
              should(json.prev).be.null;
              json.next.should.be.equal(3);
          });
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/3')
          , (json) => {
              json.should.have.properties(participant3);
              json.prev.should.be.equal(2);
              should(json.next).be.null;
          });
        })
        .then(done, done);
      });

      it('participant2', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/participant/2')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant')
          , (json) => {
              json.should.be.an.Array;
              json.should.have.length(1);
              json[0].should.have.properties(participant3);
            }
          );
        })
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant/3')
          , (json) => {
              json.should.have.properties(participant3);
              should(json.prev).be.null;
              should(json.next).be.null;
          });
        })
        .then(done, done);
      });

      it('participant3', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/participant/3')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/participant')
          , (json) => {
              json.should.be.an.Array;
              json.should.be.empty();
            }
          );
        })
        .then(done, done);
      });
    }); // remove
  }); // api
});
