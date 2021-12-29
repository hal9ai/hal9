import * as dataframe from '../core/utils/dataframe';

var config = {};

export const init = async (options) => {
  const html = options.html;
  html.innerHTML = '';

  var iframe = document.createElement("iframe");
  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';

  var secret = Math.random();
  const iframehtml = `
    <script src='${options.api}'></script>
    <script>
      async function runAsync(body, params) {
        var block = new Function("params", "return (async (params) => " + body + ")")();
        return await block(params);
      };

      function postError(message, url, line) {
        window.parent.postMessage({ secret: ${secret}, error: message }, '*');
      }

      window.onerror = function (message, url, line) {
        postError(message, url, line);
      }

      window.addEventListener('message', event => {
        if (!event.data || event.data.secret != ${secret}) return;

        (async function() {
          try {
          	const result = await runAsync(event.data.body, event.data.params);

            window.parent.postMessage({ secret: ${secret}, result: result, html: document.body.innerText.length > 0 }, '*');
          }
          catch(e) {
            postError(e.message);
          }
        })();
      }); 
    </script>
    <body>
    	<div id="output" style="width: 100%; height: 100%;"></div>
    </body>
  `;

  iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(iframehtml);

  var waitLoad = new Promise((accept, reject) => {
    iframe.addEventListener('load', accept);
    iframe.addEventListener('error', reject);
  });

  html.appendChild(iframe);
  await waitLoad;

  config = {
    iframe: iframe,
    secret: secret
  };
}

const post = async (code, params) => {
  const secret = config.secret;
  const iframe = config.iframe;

  var waitResponse = new Promise((accept, reject) => {
    var onResult = function(e) {
      if (!event.data || event.data.secret != secret) return;

      window.removeEventListener('message', onResult);

      if (event.data.error) {
        reject(event.data.error);
        return;
      }

      accept(event.data.result);
    };

    var responseListener = window.addEventListener('message', onResult);
  });

  iframe.contentWindow.postMessage({ secret: secret, body: code, params: params }, '*');
  var result = await waitResponse;

  // data frames can loose their prototype functions when crossing the iframe boundary
  Object.keys(result).forEach(key => {
    if (dataframe.isDataFrame(result[key])) {
      result[key] = dataframe.ensure(result[key]);
    }
  })

  return result;
}

export const create = async (pipelineid, context) => {
  return await post("hal9.create(params.pipelineid, params.context)", {
    pipelineid: pipelineid,
    context: context,
  })
}

export const load = async (raw) => {
  return await post("hal9.load(params.raw)", {
    raw: raw,
  })
}

export const step = async (url, params, output) => {
	return await post("hal9.step(params.url, params.params, params.output)", {
    url: url,
    params: params,
    output: output
  })
}

export const run = async (pipeline, context) => {
	return await post("hal9.run(params.pipeline, params.context)", {
    pipeline: pipeline,
    context: context,
  })
}

export const runPipeline = async (pipelineid, context) => {
  return await post("hal9.runPipeline(params.pipelineid, params.context)", {
    pipelineid: pipelineid,
    context: context,
  })
}
