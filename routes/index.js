'use strict';

const servers = require('./servers');
const status = require('./status');

module.exports = [].concat(
  servers,
  status,
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  });
