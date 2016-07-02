'use strict';

const Hapi = require('hapi');
const r = require('rethinkdb');
const server = new Hapi.Server();
const routes = require('./routes');

server.connection({ port: 4567 });
server.register([
  require('inert'),
  require('hapi-io')], (err) => {
  if (err) throw err;
});

server.route(routes);

server.start((err) => {
  if (err) throw err;
  console.log('Server running at: ' + server.info.uri);
});

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'status_servers'
  }, (err, conn) => {
  if (err) throw err;
  getChangeFeed(conn);
});

function getChangeFeed(connection) {
  r.table('servers')
    .changes()
    .run(connection, (err, cursor) => {
      const io = server.plugins['hapi-io'].io;
      cursor.each((err, change) => {
        if (err) throw err;
        io.emit('status_change', change);
      });
    });
}
