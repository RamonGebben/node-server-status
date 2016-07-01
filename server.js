'use strict';
const Hapi = require('hapi');
const fetch = require('node-fetch');
const Boom = require('boom');

const server = new Hapi.Server();


const serverList = [
  {
    "serverName":"Keystone Demo Catalogue",
    "id": "keystone-demo-catalogue",
    "url":"http://keystone.spacemetric.com/servlets/soap?REQUEST=IsAlive"
  },
  {
    "serverName":"Internal Demo",
    "id": "internal-demo",
    "url":"http://internal-demo.ad.spacemetric.se:8080/servlets/soap?REQUEST=IsAlive"
  }
];

server.connection({ port: 4567 });

server.register(require('inert'), (err) => {
  if (err) throw err; // something bad happened loading the plugin
});

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public'
    }
  }
});

server.route({
  method: 'GET',
  path: '/servers',
  handler(request, reply) {
    reply(serverList);
  }
});

server.route({
  method: 'GET',
  path: '/status/{serverName}',
  handler(request, reply) {
    const response = Boom.notFound('Unknown server name');

    const serverSearch = request.params.serverName;
    const serverInList = serverList.find(s => s.id === serverSearch);
    const found = !!serverInList;

    if(!found){
      return reply(response);
    }

    return fetch(serverInList.url)
    .then(res => {
      reply({
        name: serverInList.serverName,
        url: serverInList.url,
        status: true
      });
    })
    .catch((err) => {
      reply({
        name: serverInList.serverName,
        url: serverInList.url,
        status: false
      });
    });
  }
});

server.start((err) => {
  if (err) throw err;

  console.log('Server running at: ' + server.info.uri);
});
