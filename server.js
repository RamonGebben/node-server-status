'use strict';
const Hapi = require('hapi');
const fetch = require('node-fetch');
const Boom = require('boom');

const server = new Hapi.Server();


const serverList = [
    {
        "serverName":"Keystone Demo Catalogue",
        "serverUrl":"http://keystone.spacemetric.com/servlets/soap?REQUEST=IsAlive"
    },
    {
        "serverName":"Internal Demo",
        "serverUrl":"http://internal-demo.ad.spacemetric.se:8080/servlets/soap?REQUEST=IsAlive"
    }
];

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
    path: '/status/{serverName}',
    handler(request, reply)
    {
        var response = Boom.notFound('Unknown server name');

        var serverSearch = request.params.serverName;
        var found = false;
         
        for(var i = 0; i < serverList.length; i++){
          if((serverList[i].serverName) === (serverSearch)){
            var server = serverList[i];
            console.log("found! " + serverSearch +  " " + server.serverName);
            found = true;

            fetch(server.serverUrl)
              .then(res => {
                console.log(server.serverUrl);
                reply({
                  name: server.serverName,
                  url: server.serverUrl,
                  status: true
                });
              })
              .catch((err) => {
                reply({
                  name: server.serverName,
                  url: server.serverUrl,
                  status: false
                });
              });
          }
        }

        if(!found){
          reply(response);
        }
    }  
  })

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