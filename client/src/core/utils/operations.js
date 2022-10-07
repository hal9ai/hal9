import * as dataframe from './dataframe';

export const columns = {
  operation: function(params) {
    const df = params['data'];
    return { result: dataframe.columns(df) };
  },
  params: {}
}

export const identity =  {
  operation: (params) => {
    const df = params['data'];
    return { result: df.map(e => Object.assign({}, e)) };
  },
  params: {}
}

export const shuffle = {
  operation: (params) => {
    var shuffled = params.data.slice(0);
    var i = params.data.length;

    while (i--) {
      var index = Math.floor((i + 1) * Math.random());
      var temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }

    return { result: shuffled.slice(0, params.size) };
  },
  params: {
    size: 1000
  }
}
