import bunyan from 'bunyan';

export const log = bunyan.createLogger({
  name: 'hal9wrk',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    }
  ]
});
