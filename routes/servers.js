'use strict';

const r = require('rethinkdb');

let connection = null;

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'status_servers'
  }, (err, conn) => {
  if (err) throw err;
  connection = conn;
});

module.exports = [
  {
    method: 'GET',
    path: '/servers',
    handler(request, reply) {
      r.table('servers')
        .run(connection, (err, cursor) => {
          if (err) throw err;
          const result = cursor.toArray();
          return reply(result);
        });
    }
  },
  {
    method: 'GET',
    path: '/servers/{id}',
    handler(request, reply) {
      r.table('servers')
        .get(request.params.id)
        .run(connection, (err, result) => {
          if (err) throw err;
          return reply(result);
        });
    }
  },
  {
    method: 'POST',
    path: '/servers',
    handler(request, reply) {
      const saneObj = {
        serverName: request.payload.serverName,
        url: request.payload.serverUrl,
      };

      r.table('servers')
        .insert(saneObj)
        .run(connection, (err, result) => {
          if (err) throw err;
          return reply(result);
        });
    }
  },
  {
    method: 'PUT',
    path: '/servers/{id}',
    handler(request, reply) {
      const saneObj = {
        serverName: request.payload.serverName,
        url: request.payload.serverUrl,
      };

      r.table('servers')
        .get(request.params.id)
        .update(saneObj)
        .run(connection, (err, result) => {
          if (err) throw err;
          return reply(result);
        });
    }
  },
  {
    method: 'DELETE',
    path: '/servers/{id}',
    handler(request, reply) {
      r.table('servers')
        .get(request.params.id)
        .delete()
        .run(connection, (err, result) => {
          if (err) throw err;
          return reply(result);
        });
    }
  }
];
