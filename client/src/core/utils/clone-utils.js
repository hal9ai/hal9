import cloneDefault from './clone';

export const clone = cloneDefault

export const cloneSafe = (data) => {
  if (typeof(data) === 'object') {
    for (const key of Object.keys(data)) {
      try {
        data[key] = clone(data[key]);
      }
      catch(e) {
        console.error('Key ' + key + ' is not serializable in safeClone()');
        data[key] = null;
      }
    }
  }
  else {
    return cloneDefault(e);
  }
}