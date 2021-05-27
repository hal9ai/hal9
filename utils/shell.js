/**
  environment: worker
  cache: true
**/

const { stdout, stderr } = await exec('ls -la');

data = stdout.split('\n').map(e => ({ file: e }))
