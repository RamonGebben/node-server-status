'use strict';
const Hapi = require('hapi');
const fetch = require('node-fetch');

const server = new Hapi.Server();

const serverName = "Keystone Demo Catalogue"
const serverUrl = 'http://keystone.spacemetric.com/servlets/soap?REQUEST=IsAlive';

server.connection({ port: 4567 });

server.register(require('inert'), (err) => {

  server.route({
    method: 'GET',
    path: '/status',
    handler(request, reply) {
      fetch(serverUrl)
        .then(res => {
          reply({
            name: serverName,
            url: serverUrl,
            status: true
          });
        })
        .catch((err) => {
          reply({
            name: serverName,
            url: serverUrl,
            status: false
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