;(function() {
  const statusUrl = '/status';
  const serversUrl = '/servers';

  function buildPage(serverTemplate) {
    return fetch(serversUrl)
      .then(res => res.json())
      .then(serverListReceived)
      .then(fetchServers)
      .then(parseServerResponse)
      .then(getFilledTemplate.bind(null, serverTemplate))
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

  function getFilledTemplate(serverTemplate, servers) {
    return new Promise((resolve, reject) => {
      const templates = servers.map(server => {
        const icon = server.status ? 'glyphicon-ok' : 'glyphicon-remove';
        const status = server.status ? 'success' : 'danger';
        const filledTemplate = serverTemplate
          .replace(/{serverName}/g, server.serverName)
          .replace(/{status}/g, status)
          .replace(/{icon}/g, icon);

        return filledTemplate;
      });
      resolve(templates.join(''));
    });
  }

  function renderTemplate(template) {
    const stausWindow = document.getElementById('status');
    stausWindow.innerHTML = template;
  }

  function openModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('show');
  }

  function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
  }

  function onServerSubmit(e) {
    e.preventDefault();
    const children = [].slice.call(e.srcElement.children);
    const payload = children
      .filter(child => child.className === 'input-group')
      .reduce((acc, el) => {
        const input = el.getElementsByTagName('input')[0];
        acc[input.id] = input.value;
        return acc;
      }, {});

    fetch(serversUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(response => {
      console.log(response)
      closeModal();
      buildPage(document.getElementById('server-template').innerHTML);
    })
    .catch((err) => alert(err));
  }

  document.addEventListener('DOMContentLoaded', (event) => {
    console.info('LOADED');
    const serverTemplate = document.getElementById('server-template').innerHTML;
    const modalBody = document.getElementById('modal-body');
    const serverForm = document.getElementById('server-form');
    const addServer = document.getElementById('addServer');
    const closeModalButton = document.getElementById('closeModal');

    serverForm.addEventListener('submit', onServerSubmit);
    addServer.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);

    buildPage(serverTemplate);
  });
})();
