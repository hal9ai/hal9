export const isElectron = () => {
  return window && window.process != undefined && window.process.type == 'renderer';
}

export const isIOS = () => {
  if (!navigator) return false;

  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform);
}

export const isDevelopment = () => {
  return (!isElectron() && window.location.origin == 'file://') || window.location.origin.includes('//localhost');
}

export const getId = () => {
  var hal9env = typeof(HAL9ENV) != 'undefined' ? HAL9ENV : 'dev';

  if (typeof(process) != 'undefined' && process.env.HAL9_ENV) {
    hal9env = process.env.HAL9_ENV
  }

  // either 'local', 'dev' or 'alpha'
  return hal9env;
}

export const getServerUrl = () => {
  const hal9env = getId();
  return isDevelopment() ? 'http://localhost:5000' : 'https://' + hal9env + 'srv.hal9.ai';
}
