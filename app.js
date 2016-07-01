'use strict';

const Hapi = require('hapi');
const r = require('rethinkdb');
const server = new Hapi.Server();
const routes = require('./routes');

server.connection({ port: 4567 });
server.register(require('inert'), (err) => {
  if (err) throw err;
});

server.route(routes);

server.start((err) => {
  if (err) throw err;

  console.log('Server running at: ' + server.info.uri);
});
