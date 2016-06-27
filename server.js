'use strict';
const Hapi = require('hapi');
const fetch = require('node-fetch');

const server = new Hapi.Server();


const serverList = [
    {
        "serverName":"Keystone Demo Catalogue",
        "serverUrl":"http://keystone.spacemetric.com/servlets/soap?REQUEST=IsAlive"
    },
    {
        "serverName":"Keystone Demo Catalogue 2",
        "serverUrl":"http://keystone.spacemetric.com/servlets/soap?REQUEST=IsAlive"
    }
];
// const serverName = "Keystone Demo Catalogue"
// const serverUrl = 'http://keystone.spacemetric.com/servlets/soap?REQUEST=IsAlive';

server.connection({ port: 4567 });

server.register(require('inert'), (err) => {

  /*
  Returns information about all of the servers that can be checked
  */
  server.route({
    method: 'GET',
    path: '/servers',
    handler(request, reply){
      reply(serverList);
    }
  });

  server.route({
    method: 'GET',
    path: '/status',
    handler(request, reply) {
      fetch(serverUrl)
        .then(res => {
          reply({
            name: serverList[0].serverName,
            url: serverList[0].serverUrl,
            status: true
          });
        })
        .catch((err) => {
          reply({
            name: serverList[0].serverName,
            url: serverList[0].serverUrl,
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

  server.route({
    method: 'GET',
    path: '/app.css',
    handler: function (request, reply) {
      reply.file('./public/app.css');
    }
  });

  server.route({
    method: 'GET',
    path: '/background.jpg',
    handler: function (request, reply) {
      reply.file('./public/background.jpg');
    }
  });

  server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
  });

});