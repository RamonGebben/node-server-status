'use strict';

const fetch = require('node-fetch');

function ping(server) {
  return new Promise((resolve, reject) => {
    fetch(server.url)
      .then(res => {
        const response = Object.assign({}, server, { status: 'online' });
        resolve(response);
      })
      .catch(err => {
        const response = Object.assign({}, server, { status: 'unreachable' });
        resolve(response);
      });
  });
}

module.exports = ping;
