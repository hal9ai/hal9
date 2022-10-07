export const portScripts = (portsidentifier) => `
if (!fs.existsSync('./hal9__apis/')) fs.mkdirSync('./hal9__apis/');
const portsfile = './hal9__apis/runtime.json';
const portsidentifier = '${portsidentifier}';
console.log('Ports identifier: ' + portsidentifier)

const getAllPorts = () => {
  try {
    const rawports = fs.readFileSync(portsfile);
    return JSON.parse(rawports);
  } catch(e) {
    console.log('Error reading ports file: ' + e.toString())
    fs.writeFileSync(portsfile,  JSON.stringify({}));
    return {};
  }
}

const getNextPort = () => {
  const alldata = getAllPorts();
  const ports = Object.keys(alldata).map(e => alldata[e].port ? alldata[e].port : 0);
  return Math.max(8000, Math.max(...ports) + 1)
}

const updatePortsFile = (data) => {
  // data: hash, pid, port
  let portsinfo = getAllPorts();
  portsinfo[portsidentifier] = portsinfo[portsidentifier] ? portsinfo[portsidentifier] : {};
  portsinfo[portsidentifier] = Object.assign(portsinfo[portsidentifier], data);
  fs.writeFileSync(portsfile,  JSON.stringify(portsinfo));
}

const getPortsFile = () => {
  let portsdata = {}
  let portsinfo = getAllPorts();
  if (portsinfo[portsidentifier]) portsdata = portsinfo[portsidentifier];
  return portsdata;
}

const getPortNumber = () => {
  const portsdata = getPortsFile();
  return portsdata.port ? portsdata.port : getNextPort();
}

const portnumber = getPortNumber();
`