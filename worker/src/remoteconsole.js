
import * as fs from 'fs';

var consoles = {};

export class RemoteConsole {
  constructor(sessionid) {
    this.sessionid = sessionid;
  }

  write(type) {
    const args = [...arguments].slice(1);

    if (!consoles[this.sessionid]) consoles[this.sessionid] = [];

    consoles[this.sessionid].push({ type: type, message: args.join('') });
  }

  log() {
    this.write('log', ...arguments); 
  }

  error() {
    this.write('error', ...arguments); 
  }

  warning() {
    this.write('warning', ...arguments); 
  }
}

export const read = (sessionid) => {
  const result = consoles[sessionid];
  delete consoles[sessionid];

  return result;
}