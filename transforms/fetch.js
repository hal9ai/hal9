/**
  params: [ url ]
  environment: worker
  cache: true
**/

var downloads = [];

const fetchWithTimeout = async function(resource, timeout) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      signal: controller.signal  
    });
    clearTimeout(id);

    return response;
  }
  catch (e) {
    return null;
  }
}

const promiseAllInBatches = async (task, batchSize) => {
  let position = 0;
  let results = [];
  while (position < task.length) {
    const itemsForBatch = task.slice(position, position + batchSize);
    results = [...results, ...await Promise.all(itemsForBatch)];
    position += batchSize;
  }
  return results;
}

data.map(e => {
  const promise = fetchWithTimeout(e[url], 20000)
    .then(e => {
      if (!e) return { data: null };
      return e.arrayBuffer().then(x => {
        return { data: 'data:' + e.headers.get('content-type') + ';base64,' + btoa(x) }
      });
    })

  downloads.push(promise);
});

const downloaded = await promiseAllInBatches(downloads, 10)
  .then((data) => data)
  .catch((error) => data.map(e => {
    return Object.assign(e, { error: error.toString() });
  }));

data.map((e, idx) => {
  return Object.assign(e, downloaded[idx] );
});
