/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const utils = require('../utils');

describe('result', () => {
  before(utils.setup);

  it('html', (done) => {
    utils.expect.html(
      utils.request.html.get('/result', false)
    , ($) => {
        $('body#result-page').length.should.be.equal(1);
        $('div#result-mount').length.should.be.equal(1);
      }
    )
    .then(done, done);
  });
});
