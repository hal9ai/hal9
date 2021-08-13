
import md5 from 'crypto-js/md5';

var datasets = {};

export const save = (dataurl) => {
  const key = md5(dataurl);
  const storeurl = 'hal9:text/dataurl,' + key;
  datasets[storeurl] = dataurl;

  return storeurl;
}

export const get = (storeurl) => {
  if (storeurl.startsWith('data:')) {
    return storeurl;
  }
  else {
    var dataurl = datasets[storeurl];
    return dataurl;
  }
}
