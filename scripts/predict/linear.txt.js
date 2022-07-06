/**
  input:
    - data
    - model
  params:
    - name: x
      label: x
      static: false
      description: Predictors
    - name: 'y'
      label: 'y'
      static: false
      description: The variable that will be predicted
    - name: predictions
      label: Predictions
      value:
        - control: range
          value: 2
          min: 1
          max: 100
  cache: true
**/

if (!model) throw('Prediction requires previous step to train a model');

var current = data[0][x];
var increment = data[data.length-1][x] - data[data.length-2][x];
for (var idx = 0; idx < predictions; idx++) {
  current += increment;
  var futureRow = Object.fromEntries(Object.keys(data[data.length - 1]).map(e => [e, null]));
  futureRow[x] = current;
  data.push(futureRow);
}

const dataX = data.map(e => e[x]);

const m = tf.scalar(model.m);
const b = tf.scalar(model.b);

const predict = (x) => tf.tidy(() => m.mul(x).add(b));

const predsYs = predict(tf.tensor1d(dataX)).dataSync(0);

data = data.map((e, i) => {
  e['prediction' + y] = predsYs[i]
  return e;
});
