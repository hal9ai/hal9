import yargs from 'yargs';
import request from 'request';

import { log } from './logger';
import { port } from './port';
import { workerVersion } from './version';
import { activeRequestsCount, totalRequestsCount } from './server';


export const workersRegistrationIntervalInMS = 60 * 1000;
const registrationRetryIntervalInMS = 1000;

console.log('process.env.HAL9_INSTANCE: ' + process.env.HAL9_INSTANCE);
console.log('process.env.HAL9_SERVER_URL: ' + process.env.HAL9_SERVER_URL);
console.log('process.env.HAL9_SERVER_VERSION: ' + process.env.HAL9_SERVER_VERSION);
console.log('process.env.HAL9_WORKER_URL: ' + process.env.HAL9_WORKER_URL);
console.log('process.env.HAL9_WORKER_ROLE: ' + process.env.HAL9_WORKER_ROLE);
console.log('process.env.HAL9_WORKER_DEDICATED: ' + process.env.HAL9_WORKER_DEDICATED);
console.log('process.env.HAL9_DOCKER_IMAGE: ' + process.env.HAL9_DOCKER_IMAGE);
console.log('process.env.HAL9_DOCKER_CONTAINER: ' + process.env.HAL9_DOCKER_CONTAINER);

// yargs.parse() is used in port.js as well.
const args = yargs.parse();
const awsInstance = process.env.HAL9_INSTANCE == null ? "aws-local" : process.env.HAL9_INSTANCE;
const server = args.server ? args.server : (process.env.HAL9_SERVER_URL ? process.env.HAL9_SERVER_URL : 'http://localhost:5000');
const serverVersion = args.serverVersion ? args.serverVersion : (process.env.HAL9_SERVER_VERSION ? process.env.HAL9_SERVER_VERSION : '0.0.123');
const local = args.local ? args.local : (process.env.HAL9_WORKER_URL ? process.env.HAL9_WORKER_URL : ('http://localhost' + ':' + port + '/'));
const role = args.role ? args.role : (process.env.HAL9_WORKER_ROLE ? process.env.HAL9_WORKER_ROLE : ('Generic'));
const isDedicated = args.isDedicated ? args.isDedicated : (process.env.HAL9_WORKER_DEDICATED ? process.env.HAL9_WORKER_DEDICATED == 1 : false); // default to non dedicated, unless set to 1 ("1")
const dockerImage = args.dockerImage ? args.dockerImage : (process.env.HAL9_DOCKER_IMAGE ? process.env.HAL9_DOCKER_IMAGE : ('HAL9_127_0_0_1__80'));
const dockerContainer = args.dockerContainer ? args.dockerContainer : (process.env.HAL9_DOCKER_CONTAINER ? process.env.HAL9_DOCKER_CONTAINER : ('local-hal9'));
const workerStartTimeString = new Date().toISOString();

console.log('awsInstance: ' + awsInstance);
console.log('server: ' + server);
console.log('serverVersion: ' + serverVersion);
console.log('local: ' + local);
console.log('role: ' + role);
console.log('isDedicated: ' + isDedicated);
console.log('dockerImageName: ' + dockerImage);
console.log('dockerContainer: ' + dockerContainer);

export const register = ({ retry } = { retry: registrationRetryIntervalInMS }) => {
  const url = server + '/api/workers';

  request.put(
    url,
    {
      json: {
        worker: local, // If there is a change to local (eg always including port), please update server\workers.js - getWorkerIdforIPPort and server\manager.js - startDockerWithInit
        role: role,
        isDedicated: isDedicated,
        instanceId: awsInstance,
        serverVersion: serverVersion,
        version: workerVersion,
        dockerImageName: dockerImage,
        dockerContainer: dockerContainer,
        status: 'online',
        startTime: workerStartTimeString,
        activeRequestsCount: activeRequestsCount(),
        totalRequestsCount: totalRequestsCount()
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode != 200) {
        error = body;
      }
      if (error) {
        log.info('Failed to register worker into ' + url + ' with ' + Math.floor(retry/1000) + 's retry: ', error);
        setTimeout(() => register({ retry: retry * 2 }), retry);
      }
      else {
        log.info('Registered worker into ' + url);
        log.info(body);

        setTimeout(() => register({ retry: registrationRetryIntervalInMS }), workersRegistrationIntervalInMS);
      }
    });
}