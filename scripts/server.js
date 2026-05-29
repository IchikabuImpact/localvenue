const path = require('path');
const { createStaticServer, startStaticServer } = require('./lib/server/static-server');

const PORT = 8131;
const publicPath = path.join(__dirname, '../public');
const app = createStaticServer({ publicPath });

startStaticServer({ app, port: PORT, publicPath });
