export const paramsForFunction = (params, inputs, deps, context) => {
  const dictWithScalars = (d) => Object.fromEntries(
    Object.keys(d).map(e => {
      var value = undefined;
      if (d[e].value.length == 1) {
        const single = d[e].value[0];
        value = single.value ? single.value : single.name;
      }
      else if (d[e].value.length > 1) {
        value = d[e].value.map(e => e.value ? e.value : e.name);
      }
      return [ e, value ];
    })
  );
  
  var result = Object.assign({
    sources: null,
  }, dictWithScalars(params));

  result = Object.assign(result, inputs);
  result = Object.assign(result, deps);
  result = Object.assign(result, context);

  return result;
}

export const fetchDatasets = (params) => {
  for (var paramName in params) {
    const param = params[paramName];
    if (typeof(param) == 'string' && param.startsWith('hal9:text/dataurl')) {
      params[paramName] = datasets.get(param);
    }
  }

  return params;
}