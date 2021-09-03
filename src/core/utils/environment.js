
var userHal9Env = undefined;

export const isElectron = () => {
  return typeof(window) != 'undefined' && window.process != undefined && window.process.type == 'renderer';
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

export const setEnv = (env) => {
  userHal9Env = env;
}

export const isDevelopment = () => {
  if (typeof(window) == 'undefined') return false;

  return (!isElectron() && window.location.origin == 'file://') || window.location.origin.includes('//localhost');
}

export const getId = () => {
  if (userHal9Env) return userHal9Env;

  var hal9env = typeof(HAL9ENV) != 'undefined' ? HAL9ENV : 'dev';

  if (typeof(process) != 'undefined' && process.env.HAL9_ENV) {
    hal9env = process.env.HAL9_ENV
  }

  // either 'local', 'dev' or 'alpha'
  return hal9env;
}

export const getServerUrl = () => {
  const hal9env = getId();

  if (isDevelopment()) return 'http://localhost:5000';

  if (hal9env == 'prod') return 'https://api.hal9.com';

  return 'https://devel.hal9.com';
}
