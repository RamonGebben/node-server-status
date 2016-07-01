;(function() {
  document.addEventListener("DOMContentLoaded", function (event) {
    console.info("LOADED");

    const isUp = document.getElementById('isUp');
    const serverTemplate = document.getElementById('server-template').innerHTML;
    const stausWindow = document.getElementById('status');

    const statusUrl = "/status";
    const serversUrl = "/servers";

    function buildPage() {
      return fetch(serversUrl)
        .then(res => res.json())
        .then(serverListReceived)
        .then(fetchServers)
        .then(parseServerResponse)
        .then(getFilledTemplate)
        .then(renderTemplate);
    }

    function serverListReceived(response) {
      return new Promise((resolve, reject) => {
        if (!response || response.statusCode) {
          reject('Error fetching server list');
        }
        resolve(response);
      });
    }

    function fetchServers(servers) {
      return new Promise((resolve, reject) => {
        resolve(servers.map(server => fetch(`${statusUrl}/${server.id}`)));
      });
    }

    function parseServerResponse(promises) {
      return Promise.all(promises)
        .then(resolvements => {
          return new Promise((resolve, reject) => {
            const parsingPromises = resolvements.map(r => r.json());
            Promise.all(parsingPromises)
              .then(servers => resolve(servers))
              .catch(err => reject(err));
          });
        });
    }

    function getFilledTemplate(servers) {
      return new Promise((resolve, reject) => {
        const templates = servers.map(server => {
          const icon = server.status ? 'glyphicon-ok' : 'glyphicon-remove';
          const status = server.status ? 'success' : 'danger';
          const filledTemplate = serverTemplate
            .replace(/{serverName}/g, server.name)
            .replace(/{status}/g, status)
            .replace(/{icon}/g, icon);

          return filledTemplate;
        });
        resolve(templates.join(''));
      });
    }

    function renderTemplate(template) {
      stausWindow.innerHTML = template;
    }

    buildPage();
  });
})();
