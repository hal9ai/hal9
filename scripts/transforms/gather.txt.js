/**
  params: [ gather ]
**/

var result = [];
if (!Array.isArray(gather)) gather = [ gather ];

data.forEach(x => {
  for (idx in gather) {
    result.push(Object.assign({ key: gather[idx], value: x[gather[idx]] }, x));
  }
});

data = result;
