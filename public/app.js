;(function() {
  const statusUrl = '/status';
  const serversUrl = '/servers';

  const state = {
    servers: []
  };

  function setState(obj) {
    const oldState = Object.assign({}, state);

    Object.keys(obj).forEach(key => (state[key] = obj[key]));


    console.log('%c Old State:', 'color: red; font-weight: bold;', oldState);
    console.log('%c Change:', 'color: grey; font-weight: bold;', obj);
    console.log('%c New State:', 'color: #5FBA7D; font-weight: bold;', state);
  }

  function render(serverTemplate) {
    if (serverTemplate) setState({ serverTemplate });
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
            .then(servers => {
              resolve(servers);
              setState({ servers });
            })
            .catch(err => reject(err));
        });
      });
  }

  function getFilledTemplate(servers) {
    return new Promise((resolve, reject) => {
      const templates = servers.map(server => {
        const icon = server.status ? 'glyphicon-ok' : 'glyphicon-remove';
        const status = server.status ? 'success' : 'danger';
        const filledTemplate = state.serverTemplate
          .replace(/{serverName}/g, server.serverName)
          .replace(/{serverUrl}/g, server.url)
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

  function updateList(servers) {
    return getFilledTemplate(servers)
      .then(renderTemplate);
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
      closeModal();
    })
    .catch((err) => alert(err));
  }

  function getChangeType(change) {
    if (!change.old_val) return 'create';
    if (!change.new_val) return 'delete';
    return 'update';
  }

  function onServerStatusChange(change) {
    const changeType = getChangeType(change);
    const changedServer = change.new_val || change.old_val;
    const servers = [].concat.apply(state.servers);
    const serverIndex = state.servers.findIndex(s => s.id === changedServer.id);

    switch (changeType) {
      case 'create':
        console.log('-- NEW SERVER --');
        servers.push(changedServer);
        break;
      case 'delete':
        console.log('-- DELETE SERVER --');
        servers.splice(serverIndex, 1);
        break;
      default:
        servers[serverIndex] = changedServer;
        break;
    }

    setState({ servers });
    setTimeout(updateList.bind(null, servers), 0);
  }

  document.addEventListener('DOMContentLoaded', (event) => {
    setState({ loaded: true });
    const serverTemplate = document.getElementById('server-template').innerHTML;
    const modalBody = document.getElementById('modal-body');
    const serverForm = document.getElementById('server-form');
    const addServer = document.getElementById('addServer');
    const closeModalButton = document.getElementById('closeModal');
    const socket = io();

    socket.on('status_change', onServerStatusChange);

    serverForm.addEventListener('submit', onServerSubmit);
    addServer.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);

    render(serverTemplate);
  });
})();
