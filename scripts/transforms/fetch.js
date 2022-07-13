/**
  params:
    - name: url
      label: URL
    - name: resize
      label: Resize
      value:
        - control: select
          value: no
          values:
            - name: no
              label: No
            - name: 64
              label: 64px
            - name: 128
              label: 128px
            - name: 256
              label: 256px
            - name: 512
              label: 512px
  environment: worker
  cache: true
**/

var downloads = [];

if (!url) throw 'Specify the URL field to fetch from';

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
    return e.toString();
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

const contentTypeMap = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

async function resizeImage(ab, type, size) {
  const buffer = Buffer.from(ab, 'binary');
  let src = new Sharp(buffer);

  const mapped = contentTypeMap[type];
  if (!mapped) throw 'Type ' + type + ' is unsupported';

  await src[mapped]();
  await src.resize(size, null);
  const metadata = await src.metadata();
  if (metadata.icc) delete metadata.icc; 
  const rb = await src.toBuffer();
  return [ rb, metadata ];
}

data.map(e => {
  const promise = async function() {
    var fetched = await fetchWithTimeout(e[url], 20000);
    if (typeof(fetched) == 'string') return { data: fetched };

    var ab = await fetched.arrayBuffer();
    const contentType = fetched.headers.get('content-type');
    
    var metadata = undefined;
    if (resize !== 'no')
      [ ab, metadata ] = await resizeImage(ab, contentType, parseInt(resize));
    
    return {
      data: 'data:' + contentType + ';base64,' + btoa(ab),
      metadata: metadata
    }
  };

  downloads.push(promise());
});
 
const downloaded = await promiseAllInBatches(downloads, 10)
  .then((data) => data)
  .catch((error) => data.map(e => {
    return Object.assign(e, { error: error.toString() });
  }));

data.map((e, idx) => {
  return Object.assign(e, downloaded[idx] );
});
