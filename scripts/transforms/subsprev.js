/**
  params: [ substractions ]
**/

var result = [];

if (!Array.isArray(substractions)) substractions = [ substractions ];

data = data.map((x, idx) => {
  var diff = Object.assign({}, x);
  for (gi in substractions) {
    if (substractions[gi]) {
      if (idx == 0) {
        diff[substractions[gi] + 'sub'] = 0;
      }
      else {
        diff[substractions[gi] + 'sub'] = diff[substractions[gi]] - data[idx-1][substractions[gi]];
      }
    }
  }
  return diff;
});

