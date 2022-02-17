var depsCache = {};

const upgradeDep = (dep) => {
  if (dep == 'https://cdn.jsdelivr.net/npm/hal9-utils@0.0.4/dist/hal9-utils.min.js')
    return 'https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js'

  return dep;
} 

const loadDepsForBrowser = async function(deps) {
  for (var depidx in deps) {
    var dep = upgradeDep(deps[depidx]);
    if (!Object.keys(depsCache).includes(dep) || depsCache[dep] === 'loading') {
      var promise = null;
      if (depsCache[dep] === 'loading') {
        promise = new Promise((accept, reject) => {
          var check = () => {
            if (depsCache[dep] === 'loading') {
              setTimeout(check, 100);
            }
            else {
              if (depsCache[dep] === 'loaded')
                accept();
              else
                reject();
            }
          }
        })
      }
      else {
        promise = new Promise((accept, reject) => {
          var script = document.createElement('script');
          depsCache[dep] = 'loading';
          script.src = dep;
          document.head.appendChild(script);
          script.addEventListener("load", function(event) {
            depsCache[dep] = 'loaded';
            accept();
          });
          script.addEventListener("error", function(event) {
            depsCache[dep] = 'error';
            reject();
          });
        });
      }

      await promise;
    }
  };

  return '';
}

const loadDepsForJS = async function(deps, params) {
  const depscode = await Promise.all(deps.map(dep => {
    if (Object.keys(depsCache).includes(dep))
      return Promise.resolve(depsCache[dep]);
    else {
      const fetchFunc = typeof fetch === 'function' ? fetch : params.fetch;
      return fetchFunc(dep).then(resp => resp.text());
    }
  }));

  deps.map((dep, idx) => {
    depsCache[dep] = depscode[idx];
  });

  return depscode.join('\n') + '\n\n';
}

export const loadScripts = async function(deps, _fetch) {
  if (typeof(window) != 'undefined')
    await loadDepsForBrowser(deps);
  else
    await loadDepsForJS(deps, _fetch);
}
