
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

  return (!isElectron() && window.location.origin == 'file://') ||
    window.location.origin.includes('//localhost');
}

export const isOtherDevelopment = () => {
  if (typeof(window) == 'undefined') return null;

  if (window.location.origin.includes('mshome.net'))
    return window.location.protocol + "//" + window.location.hostname;
}

export const getId = () => {
  if (userHal9Env) return userHal9Env;

  var hal9env = typeof(HAL9ENV) != 'undefined' ? HAL9ENV : 'dev';

  if (typeof(process) != 'undefined' && process.env.HAL9_ENV) {
    hal9env = process.env.HAL9_ENV
  }

  // either 'local', 'dev' or 'prod'
  return hal9env;
}

export const getServerUrl = () => {
  const hal9env = getId();

  if (isOtherDevelopment()) return isOtherDevelopment() + ':5000';

  if (userHal9Env === 'local' || isDevelopment()) return 'http://localhost:5000';

  if (hal9env == 'prod') return 'https://api.hal9.com';

  return 'https://api.devel.hal9.com';
}

export const getServerCachedUrl = () => {
  const hal9env = getId();

  if (isOtherDevelopment()) return isOtherDevelopment() + ':5000';

  if (userHal9Env === 'local' || isDevelopment()) return 'http://localhost:5000';

  if (hal9env == 'prod') return 'https://hal9.com';

  return 'https://devel.hal9.com';
}

export const getWebsiteUrl = () => {
  const id = getId();
  const map = {
    local: 'http://localhost:5000',
    dev: 'https://devel.hal9.com',
    prod: 'https://hal9.com',
  };

  if (!map[id]) throw 'The environment \'' + id + '\' is not mapped to a frontend server.'

  return map[id];
}

export const getLibraryUrl = () => {
  return 'https://cdn.jsdelivr.net/npm/hal9@0.0.112/dist/hal9.min.js';
}
