'use strict';

const fetch = require('node-fetch');

function ping(server) {
  return new Promise((resolve, reject) => {
    fetch(server.url)
      .then(res => {
        const response = Object.assign({}, server, { status: true });
        resolve(response);
      })
      .catch(err => {
        const response = Object.assign({}, server, { status: false });
        resolve(response);
      });
  });
}

module.exports = ping;
