
import * as hal9 from 'hal9';
import * as os from 'os';
const fs = require('fs').promises;

var dfCacheCount = 0;

const cachePath = (cacheid) => {
  return os.tmpdir() + '/hal9__remotedf__' + cacheid + '.json';
}

export const setDeps = (deps) => {
  hal9.dataframe.setDeps(deps);
}

export const dehydrate = async (result, deps, options) => {
  const minRows = options === true ? 10000 : parseInt(options);

  for (const key of Object.keys(result)) {
    if (hal9.dataframe.isDataFrame(result[key])) {
      const serialized = JSON.stringify(await hal9.dataframe.serialize(result[key]));

      if (serialized.length > minRows) {

        const cacheid = ++dfCacheCount;
        await fs.writeFile(cachePath(cacheid), serialized);

        result[key] = {
          subset: await hal9.dataframe.toRows(await hal9.dataframe.top(result[key], minRows)),
          type: 'remotedf',
          id: cacheid
        }
      }
    }
  }

  return result;
}

export const hydrate = async (result, deps) => {
  for (const key of Object.keys(result)) {
    if (typeof(result[key]) == 'object' && result[key].type == 'remotedf') {
      const cachepath = cachePath(result[key].id);

      const serialized = (await fs.readFile(cachepath)).toString();

      result[key] = await hal9.dataframe.deserialize(JSON.parse(serialized));
    }
  }

  return result;
}
