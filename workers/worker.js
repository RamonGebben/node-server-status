'use strict';

const ping = require('./ping');
const schedule = require('node-schedule');
const r = require('rethinkdb');

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'status_servers'
  }, (err, conn) => {
  if (err) throw err;
  startJob(conn);
});

function startJob(connection) {
  const job = schedule.scheduleJob('10 * * * * *', () => {
    const startTime = Date.now();
    console.log(`[${new Date().toTimeString()}] -- Pinnging all servers --`);
    pingAllServers(connection)
      .then(results => {
        const endTimeInSeconds = ((Date.now() - startTime) / 60).toFixed(2);
        console.log(
          `[${new Date().toTimeString()}] -- Finished pinging all servers and took ${endTimeInSeconds} seconds --`
        );
      });
  });
  console.log('-- Main job started --');
}

function getAllServer(connection) {
  return new Promise((resolve, reject) => {
    r.table('servers')
      .run(connection, (err, cursor) => {
        if (err) reject(err);
        cursor.toArray().then(res => {
          resolve(res);
        });
    });
  });
}

function updateRecord(id, record, connection) {
  return new Promise((resolve, reject) => {
    r.table('servers')
      .get(id)
      .update(record)
      .run(connection, (err, result) => {
        if(err) return reject(err);
        return resolve(result);
      })
  });
}

function updateDatabase(connection, servers) {
  return new Promise((resolve, reject) => {
    const promises = servers.map(server => updateRecord(server.id, server, connection));
    Promise.all(promises)
      .then(res => {
        return resolve(res);
      }).catch(err => {
        return reject(err);
      });
  });
}

function pingAllServers(connection) {
  return new Promise((resolve, reject) => {
    getAllServer(connection)
      .then(servers => {
        const promises = servers.map(server => ping(server));
        Promise.all(promises)
          .then(results => {
            updateDatabase(connection, results)
              .then(res => {
                console.log('-- Updated all servers --');
                resolve(res);
              }).catch(err => { throw err; });
          });
      }).catch(err => {
        throw err;
      });
  });
}
