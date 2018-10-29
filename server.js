/**
 * Copyright (C) 2018 Hiro Fujita <bow.fujita@gmail.com>
 */

'use strict';

const express = require('express')
    , server = express()
    , app = require('./backend')
;

app.setup(server)
.then(() => {
  const port = server.get('port');
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening on port ${port}`);
  });
})
.catch((err) => {
  console.log(err);
  process.exit(1);
});
