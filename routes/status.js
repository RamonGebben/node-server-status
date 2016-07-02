'use strict';

const r = require('rethinkdb');
const fetch = require('node-fetch');
let connection = null;

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'status_servers'
  }, (err, conn) => {
  if (err) throw err;
  connection = conn;
});

function getServer(id) {
  return new Promise((resolve, reject) => {
    r.table('servers').get(id).run(connection, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

module.exports = [
  {
    method: 'GET',
    path: '/status/{id}',
    handler(request, reply) {
      getServer(request.params.id)
        .then(server => {
          reply(server);
        });
    }
  }
]
