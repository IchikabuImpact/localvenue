'use strict';

const express = require('express');

function createStaticServer({ publicPath }) {
  const app = express();
  app.use(express.static(publicPath));
  return app;
}

function startStaticServer({ app, port, publicPath }) {
  return app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Serving files from: ${publicPath}`);
  });
}

module.exports = {
  createStaticServer,
  startStaticServer,
};
