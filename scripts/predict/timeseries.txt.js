/**
  params:
    - name: prediction
      label: Prediction
    - name: window
      label: Window Size
      value:
        - control: number
          value: 20
    - name: units
      label: Units
      value:
        - control: number
          value: 12
    - name: epochs
      label: Epochs
      value:
        - control: number
          value: 1
    - name: predictions
      label: Predictions
      value:
        - control: number
          value: 10
  cache: true
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.8.3/dist/tf.js
    - https://cdn.jsdelivr.net/npm/d3@6
    - https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1
**/

data = await hal9.utils.toArquero(data);
  
window = parseInt(window);
predictions = parseInt(predictions);

tf.setBackend('cpu');
tf.disposeVariables();

if(prediction) {
  // Moving average
  data = data.params({prediction}).derive({ sma: aq.rolling((d, $) => op.average(d[$.prediction]), [window, 0]) });
  data = data.rename({ sma : "sma" + prediction });

  // Window 
  var smacol = data.array("sma" + prediction) 
  var windowarray = [];
  for(let i = 0; i < smacol.length; i++) {
    windowarray.push(
      data.slice(i - window, i + predictions).array('sma' + prediction)
    )
  }

  data = data.assign({ window: windowarray }).slice(window);
  data = data.rename({ window: "window" + prediction });
 
  // Model 
  var allwindows = data.array("window" + prediction) 
  
  // Normalize X
  x_train = [];
  x_predict = [];
  y_train = [];
  x_train_max = data.count().array('count')[0] - predictions;
  allwindows.forEach((win, i) => {
    const x_input = win.slice(0, window);
    const min = Math.min(...x_input);
    const max = Math.max(...x_input);

    const x_elem = x_input.map(e => (e - min) / (max - min));
    x_predict.push(x_elem);

    if (i < x_train_max) {
      x_train.push(x_elem);

      const y_output = win.slice(window, window + predictions);
      y_train.push(y_output.map(e => (e - min) / (max - min)));
    }
  });
  
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: parseInt(units), returnSequences: false, inputShape:[window, 1] }));
  model.add(tf.layers.dropout(0.2))
  model.add(tf.layers.dense({ units: predictions, activation: 'relu' }));
  
  model.compile({
    loss: 'meanSquaredError',
    optimizer: 'sgd',
    metrics: ['accuracy']
  });
  
  const xs = tf.tensor(x_train).reshape([-1, window, 1])
  const ys = tf.tensor(y_train).reshape([-1, predictions]);

  await model.fit(xs, ys, {
    epochs: parseInt(epochs),
    batchSize: window,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        console.log('Accuracy', logs.acc);
        if (hal9.isAborted && await hal9.isAborted())
          model.stopTraining = true; 
      },
      onEpochEnd: async (epoch, logs) => {
      }
    }
  });

  if (hal9.isAborted && await hal9.isAborted())
    throw "Training stopped"

  const xp = tf.tensor(x_predict).reshape([-1, window, 1])
  
  const results = model.predict(xp).arraySync();
  if (results.length != allwindows.length) throw('Expecting window with ' + results.length + ' rows but got ' + allwindows.length);

  var futurePredictions = []

  data = data.assign({
    prediction: results.map((e, i) => {
      const win = allwindows[i];
      const x_input = win.slice(0, window);

      const min = Math.min(...x_input);
      const max = Math.max(...x_input);

      if (i == 49) debugger;;
      if (i == results.length - 1){
        const last = results.length - 1;
        for (let j = 1; j < predictions; j++) {
          futurePredictions.push(results[last][j] * (max - min) + min);
        }
      }

      return e[0] * (max - min) + min;
    })
  });

  const predtable = aq.table({ prediction: futurePredictions });

  //data = data.select(['Year', 'prediction']);
  data = data.union(predtable)

  data = data.select(aq.not('window' + prediction));
}
