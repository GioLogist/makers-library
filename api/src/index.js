/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);
const { logHello } = require('shared-lib');

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>{
  logHello()
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
});
