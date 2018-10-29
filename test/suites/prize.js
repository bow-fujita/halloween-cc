/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const utils = require('../utils');

describe('prize', () => {
  before(utils.setup);

  it('html', (done) => {
    utils.expect.html(
      utils.request.html.get('/prizes', false)
    , ($) => {
        $('body#prizes-page').length.should.be.equal(1);
        $('div#prizes-mount').length.should.be.equal(1);
      }
    )
    .then(done, done);
  });

  describe('api', () => {
    let prize1 = {
          sponsor: 'Mitsuwa'
        , item: 'Rice'
        , quantity: 2
        }
      , prize2 = {
          sponsor: 'Kinokuniya'
        , item: 'Gift card'
        , quantity: 3
        }
      , prize3 = {
          sponsor: 'Kahoo'
        , item: 'Ramen'
        , quantity: 5
        };

    describe('list', () => {
      it('empty', (done) => {
        utils.expect.json(
          utils.request.api
          .get('/prize')
        , (json) => {
            json.should.be.Array;
            json.should.be.empty();
          }
        )
        .then(done, done);
      });
    });

    describe('add', () => {
      it('undefined sponsor', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .post('/prize')
          .send(utils.param.omit(prize1, 'sponsor'))
        )
        .then(done, done);
      });

      it('undefined item', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .post('/prize')
          .send(utils.param.omit(prize1, 'item'))
        )
        .then(done, done);
      });

      it('undefined quantity', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .post('/prize')
          .send(utils.param.omit(prize1, 'quantity'))
        )
        .then(done, done);
      });

      it('empty sponsor', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .post('/prize')
          .send(utils.param.overwrite(prize1, {
            sponsor: ''
          }))
        , 'Sponsor'
        )
        .then(done, done);
      });

      it('empty item', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .post('/prize')
          .send(utils.param.overwrite(prize1, {
            item: ''
          }))
        , 'Item'
        )
        .then(done, done);
      });

      it('empty quantity', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .post('/prize')
          .send(utils.param.overwrite(prize1, {
            quantity: ''
          }))
        , 'Quantity'
        )
        .then(done, done);
      });

      it('invalid quantity', (done) => {
        utils.expect.jsonErrorParamInvalid(
          utils.request.api
          .post('/prize')
          .send(utils.param.overwrite(prize1, {
            quantity: 'abc'
          }))
        , 'Quantity'
        )
        .then(done, done);
      });

      it('prize1', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/prize')
          .send(prize1)
        )
        .then(() => {
          prize1.id = 1;
          prize1.priority = 1;

          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(1);
              json[0].should.have.properties(prize1);
            }
          );
        })
        .then(done, done);
      });

      it('prize2', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/prize')
          .send(prize2)
        )
        .then(() => {
          prize2.id = 2;
          prize2.priority = 1;
          prize1.priority = 2;

          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(2);
              json[0].should.have.properties(prize1);
              json[1].should.have.properties(prize2);
            }
          );
        })
        .then(done, done);
      });

      it('prize3', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/prize')
          .send(prize3)
        )
        .then(() => {
          prize3.id = 3;
          prize3.priority = 1;
          prize2.priority = 2;
          prize1.priority = 3;

          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize1);
              json[1].should.have.properties(prize2);
              json[2].should.have.properties(prize3);
            }
          )
        })
        .then(done, done);
      });
    }); // add

    describe('edit', () => {
      it('not found', (done) => {
        utils.expect.json(
          utils.request.api
          .put('/prize/999')
          .send(prize1)
        , 404
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize1);
              json[1].should.have.properties(prize2);
              json[2].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });

      it('undefined sponsor', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.omit(prize1, 'sponsor'))
        )
        .then(done, done);
      });

      it('undefined item', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.omit(prize1, 'item'))
        )
        .then(done, done);
      });

      it('undefined quantity', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.omit(prize1, 'quantity'))
        )
        .then(done, done);
      });

      it('empty sponsor', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.overwrite(prize1, {
            sponsor: ''
          }))
        , 'Sponsor'
        )
        .then(done, done);
      });

      it('empty item', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.overwrite(prize1, {
            item: ''
          }))
        , 'Item'
        )
        .then(done, done);
      });

      it('empty quantity', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.overwrite(prize1, {
            quantity: ''
          }))
        , 'Quantity'
        )
        .then(done, done);
      });

      it('invalid quantity', (done) => {
        utils.expect.jsonErrorParamInvalid(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.overwrite(prize1, {
            quantity: 'abc'
          }))
        , 'Quantity'
        )
        .then(done, done);
      });

      it('change sponsor', (done) => {
        prize1.sponsor = 'Marukai';
        utils.expect.json(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.omit(prize1, 'id'))
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize1);
              json[1].should.have.properties(prize2);
              json[2].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });

      it('change item', (done) => {
        prize1.item = 'Kobe Beef';
        utils.expect.json(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.omit(prize1, 'id'))
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize1);
              json[1].should.have.properties(prize2);
              json[2].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });

      it('change quantity', (done) => {
        prize1.quantity = 1;
        utils.expect.json(
          utils.request.api
          .put('/prize/1')
          .send(utils.param.omit(prize1, 'id'))
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize1);
              json[1].should.have.properties(prize2);
              json[2].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });
    }); // edit

    describe('reorder', () => {
      it('undefined order', (done) => {
        utils.expect.jsonErrorParamShortage(
          utils.request.api
          .post('/prize/reorder')
        )
        .then(done, done);
      });

      it('empty order', (done) => {
        utils.expect.jsonErrorParamRequired(
          utils.request.api
          .post('/prize/reorder')
          .send({ order: '' })
        , 'Order'
        )
        .then(done, done);
      });

      it('3-2-1', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/prize/reorder')
          .send({ order: '3,2,1' })
        )
        .then(() => {
          prize3.priority = 3;
          prize2.priority = 2;
          prize1.priority = 1;

          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize3);
              json[1].should.have.properties(prize2);
              json[2].should.have.properties(prize1);
            }
          );
        })
        .then(done, done);
      });

      it('2-3-1', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/prize/reorder')
          .send({ order: '2,3,1' })
        )
        .then(() => {
          prize2.priority = 3;
          prize3.priority = 2;
          prize1.priority = 1;

          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize2);
              json[1].should.have.properties(prize3);
              json[2].should.have.properties(prize1);
            }
          );
        })
        .then(done, done);
      });

      it('2-1-3', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/prize/reorder')
          .send({ order: '2,1,3' })
        )
        .then(() => {
          prize2.priority = 3;
          prize1.priority = 2;
          prize3.priority = 1;

          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize2);
              json[1].should.have.properties(prize1);
              json[2].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });

      it('1-2-3', (done) => {
        utils.expect.json(
          utils.request.api
          .post('/prize/reorder')
          .send({ order: '1,2,3' })
        )
        .then(() => {
          prize1.priority = 3;
          prize2.priority = 2;
          prize3.priority = 1;

          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize1);
              json[1].should.have.properties(prize2);
              json[2].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });
    }); // reorder

    describe('remove', () => {
      it('not found', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/prize/999')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(3);
              json[0].should.have.properties(prize1);
              json[1].should.have.properties(prize2);
              json[2].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });

      it('prize1', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/prize/1')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(2);
              json[0].should.have.properties(prize2);
              json[1].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });

      it('prize2', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/prize/2')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/prize')
          , (json) => {
              json.should.be.Array;
              json.should.have.length(1);
              json[0].should.have.properties(prize3);
            }
          );
        })
        .then(done, done);
      });

      it('prize3', (done) => {
        utils.expect.json(
          utils.request.api
          .del('/prize/3')
        )
        .then(() => {
          return utils.expect.json(
            utils.request.api
            .get('/prize')
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
