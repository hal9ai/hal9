/**
  params:
    - name: x
      label: X
    - name: y
      label: Y
    - name: type
      label: Type
      value:
        - control: select
          value: linear
          values:
            - name: linear
              label: Linear    
            - name: exponential
              label: Exponential
            - name: logarithmic
              label: Logarithmic
            - name: power
              label: Power
            - name: sigmoid
              label: Sigmoid
            - name: polynomial
              label: Polynomial
    - name: predictions
      label: Predictions
      value:
        - control: range
          value: 0
          min: 0
          max: 100
  output:
    - data
    - html
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@0.0.4/dist/hal9-utils.min.js
    - 'https://cdn.jsdelivr.net/npm/d3@6'
    - 'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1'
**/
data = await hal9.utils.toRows(data);

tf.setBackend('cpu');

if (!x) {
  var x = '_id';
  data.map((e,i) => Object.assign(e, { '_id': i }))
}

// Train

const trainX = tf.tensor1d(data.map(e => hal9.utils.convert(e[x])));
const trainY = tf.tensor1d(data.map(e => hal9.utils.convert(e[y])));

const [maxX, minX] = [trainX.max(), trainX.min()];
const normX = trainX.sub(minX).div(maxX.sub(minX));
const [maxY, minY] = [trainY.max(), trainY.min()];
const normY = trainY.sub(minY).div(maxY.sub(minY));

const learningRate = 0.3;
const epochs = 100;

var regressions = {
  linear: () => {
    const m = tf.variable(tf.scalar(Math.random()));
    const b = tf.variable(tf.scalar(Math.random()));
    return (x) => m.mul(x).add(b);
  },
  exponential: () => {
    const a = tf.variable(tf.scalar(Math.random()));
    const b = tf.variable(tf.scalar(Math.random()));
    return (x) => b.mul(x).exp().mul(a);
  },
  logarithmic: () => {
    const a = tf.variable(tf.scalar(Math.random()));
    const b = tf.variable(tf.scalar(Math.random()));
    return (x) => x.add(a).log().mul(b);
  },
  power: () => {
    const a = tf.variable(tf.scalar(Math.random()));
    const b = tf.variable(tf.scalar(Math.random()));
    return (x) => x.pow(b).mul(a);
  },
  sigmoid: () => {
    const a = tf.variable(tf.scalar(Math.random()));
    const b = tf.variable(tf.scalar(Math.random()));
    const c = tf.variable(tf.scalar(Math.random()));
    const d = tf.variable(tf.scalar(Math.random()));
    return (x) => x.mul(a).add(b).sigmoid().mul(c).add(d);
  },
  polynomial: () => {
    const a = tf.variable(tf.scalar(Math.random()));
    const b = tf.variable(tf.scalar(Math.random()));
    const c = tf.variable(tf.scalar(Math.random()));
    return (x) => x.sqrt().mul(a).add(b.mul(x)).add(c);
  }
}

const predict = regressions[type]();

const loss = (pred, actual) => pred.sub(actual).square().mean();
const optimizer = tf.train.adam(learningRate);

for (let idx = 0; idx < epochs; idx++) {
  tf.tidy(() => {
    optimizer.minimize(function() { 
      const predsYs = predict(normX); 
      stepLoss = loss(predsYs, normY);   
      return stepLoss; 
    }); 
  });
}

// Predict

var current = hal9.utils.convert(data[data.length-1][x]);
var increment = data[data.length-1][x] - data[data.length-2][x];
var predTotal = Math.round(1.0 * data.length * predictions / 100);
for (var idx = 0; idx < predTotal; idx++) {
  if (typeof current.getMonth === 'function') {
    current = new Date(current.getTime() + increment);
  }
  else {
    current += increment;
  }

  var futureRow = Object.fromEntries(Object.keys(data[data.length - 1]).map(e => [e, null]));
  futureRow[x] = current;
  data.push(futureRow);
}

var predsX = tf.tensor1d(data.map(e => hal9.utils.convert(e[x])));
var predsNormX = predsX.sub(minX).div(maxX.sub(minX));
var normPreds = predict(predsNormX);
var preds = normPreds.mul(maxY.sub(minY)).add(minY).dataSync();

data = data.map((e, i) => {
  e['prediction(' + y + ')'] = preds[i];
  return e;
});

// Chart

if (y && !Array.isArray(y)) y = [y];
if (!y) { y = [] } else { y.push('prediction(' + y + ')') };

const chartdata = x && y.length
 ? data.map(v => {
     const value = { x: hal9.utils.convert(v[x]) };
     y.map((yv, i) => {
       value[`y${i}`] = hal9.utils.convert(v[yv]);
     });
     return value;
   })
 : [];

html.appendChild(Plot.plot({
  marks: [
    Plot.line(chartdata, {
      x: x ? "x" : [],
      y: `y1`,
      stroke: d3.schemeTableau10[1],
      strokeWidth: 3,
      strokeDasharray: "2,3"
    }),
    Plot.line(chartdata, {
      x: x ? "x" : [],
      y: `y0`,
      stroke: d3.schemeTableau10[0],
      strokeWidth: 3,
    })
  ],
  x: { grid: true },
  y: {
    grid: true,
    tickFormat: (d) => (d > 1000 ? d3.format('~s')(d) : d),
  },
  width: html.clientWidth,
  height: html.clientHeight,
  style: {
    background: hal9.isDark() ? "#222" : '',
    color: hal9.isDark() ? "white" : ''
  },
}));
