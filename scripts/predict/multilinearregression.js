/**
  params:
    - name: x
      label: X
    - name: 'y'
      label: 'Y'
  output:
    - data
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js
**/
data = await hal9.utils.toArquero(data);
if (x && y) {
  tf.disposeVariables();
  if (!Array.isArray(x)) x = [x];
  var x_t = []
  for (let i = 0; i < x.length; i++) {
    x_t.push(data.array(x[i]))
  }
  const normalize = tensor =>
  tf.div(
    tf.sub(tensor, tf.min(tensor)),
    tf.sub(tf.max(tensor), tf.min(tensor))
  );
  x_t = normalize(tf.tensor2d(x_t));
  console.log(x_t)
  y_t = tf.tensor(data.array(y));
  const trainModel = async (xTrain, yTrain) => {
    const model = tf.sequential();
    model.add(
    tf.layers.dense({
      inputShape: [xTrain.shape[1]],
      units: xTrain.shape[1],
      activation: "sigmoid"
    })
  );
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
      optimizer: tf.train.sgd(0.001),
      loss: "meanSquaredError",
      metrics: [tf.metrics.meanAbsoluteError]
    });
    const trainLogs = [];
    await model.fit(xTrain, yTrain, {
      batchSize: 32,
      epochs: 100,
      shuffle: true,
      validationSplit: 0.1,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          trainLogs.push({
            rmse: Math.sqrt(logs.loss),
            val_rmse: Math.sqrt(logs.val_loss),
            mae: logs.meanAbsoluteError,
            val_mae: logs.val_meanAbsoluteError
          });
        }
      }
    });
    return model;
  }
  model = await trainModel(x_t, y_t);
  predictSet = data.select(x);
  predictions = [];
  for (const rowObject of predictSet) {
    variables = tf.tensor(Object.values(rowObject));
    predictions.push( model.predict(variables));
  }
  data = data.assign({Predictions: predictions});
}
