'use strict';
const Hapi = require('hapi');
const fetch = require('node-fetch');

const server = new Hapi.Server();
const keystoneUrl = 'http://keystone.spacemetric.com/servlets/soap?REQUEST=IsAlive';

server.connection({ port: 4567 });

server.register(require('inert'), (err) => {

  server.route({
    method: 'GET',
    path: '/status',
    handler(request, reply) {
      fetch(keystoneUrl)
        .then(res => {
          reply(res);
        })
        .catch((err) => {
          reply({
            status: 500,
            error: err
          });
        });
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler(request, reply) {
      reply.file('./public/hello.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/app.js',
    handler: function (request, reply) {
      reply.file('./public/app.js');
    }
  });

  server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
  });

});