
var userHal9Env = undefined;

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

export const getUserEnv = (env) => {
  return userHal9Env;
}

export const isDevelopment = () => {
  if (typeof(window) == 'undefined') return false;

  return window.location.origin.includes('//localhost');
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

const getLocalhostServerUrl = () => {
  const isHttps = ((typeof(window) !== 'undefined') && (window.location.protocol === 'https:'));
  return (isHttps ? 'https://localhost:5000' : 'http://localhost:5000');
};

export const getServerUrl = () => {
  const hal9env = getId();

  if (hal9env == 'prod') return 'https://api.hal9.com';

  if (userHal9Env === 'local' || isDevelopment()) return getLocalhostServerUrl();

  return 'https://api.devel.hal9.com';
}

export const isNotProduction = () => {
  return 'prod' != getId();
}

export const getServerCachedUrl = () => {
  const hal9env = getId();

  if (hal9env == 'prod') return 'https://hal9.com';

  if (userHal9Env === 'local' || isDevelopment()) return getLocalhostServerUrl();

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
  return 'https://cdn.jsdelivr.net/npm/hal9@' + VERSION + '/dist/hal9.js';
}
