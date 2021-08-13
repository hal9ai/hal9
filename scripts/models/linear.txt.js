/**
  params:
    - name: x
      label: Y
    - name: y
      label: Y
    - name: epochs
      label: Epochs
      value:
        - control: range
          value: 5
          min: 1
          max: 20
    - name: learning
      label: Learning
      value:
        - control: range
          value: 2
          min: 1
          max: 20
  output:
    - model
**/

const trainX = data.map(e => e[x]);
const trainY = data.map(e => e[y]);

const m = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));

const learningRate = Math.pow(10, -learning);
const predict = (x) => tf.tidy(() => m.mul(x).add(b));
const loss = (pred, actual) => pred.sub(actual).square().mean();
const optimizer = tf.train.sgd(learningRate);

for (let idx = 0; idx < epochs; idx++) {
  optimizer.minimize(function() { 
    const predsYs = predict(tf.tensor1d(trainX)); 
    stepLoss = loss(predsYs, tf.tensor1d(trainY))   
    return stepLoss; 
  }); 
}

model = {
  m: m.dataSync()[0],
  b: b.dataSync()[0],
}
