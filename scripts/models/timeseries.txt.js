/**
  params:
    - name: window
      label: Window
    - name: prediction
      label: Prediction
    - name: epochs
      label: Epochs
      value:
        - control: range
          value: 1
          min: 1
          max: 20
    - name: trainingsize
      label: Training Size
      value:
        - control: range
          value: 98
          min: 70
          max: 100
  output:
    - data
    - model
    - stats
  cache: true
**/

if (!prediction || !window) throw('Prediction and Window parameters are required.');

let inputs = data.map(e => e[window]);
let outputs = data.map(e => parseFloat(e[prediction]));

let windowsize = data[0][window].length;
let learningrate = 0.01;
let hiddenlayers = 4;

async function trainModel(X, Y, window_size, n_epochs, learning_rate, n_layers, callback) {
  const input_layer_shape  = window_size;
  const input_layer_neurons = 100;

  const rnn_input_layer_features = 10;
  const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;

  const rnn_input_shape  = [rnn_input_layer_features, rnn_input_layer_timesteps];
  const rnn_output_neurons = 20;

  const rnn_batch_size = window_size;

  const output_layer_shape = rnn_output_neurons;
  const output_layer_neurons = 1;

  const model = tf.sequential();

  const xs = tf.tensor2d(X, [X.length, X[0].length]);
  const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]);

  model.add(tf.layers.dense({units: input_layer_neurons, inputShape: [input_layer_shape]}));
  model.add(tf.layers.reshape({targetShape: rnn_input_shape}));

  let lstm_cells = [];
  for (let index = 0; index < n_layers; index++) {
       lstm_cells.push(tf.layers.lstmCell({units: rnn_output_neurons}));
  }

  model.add(tf.layers.rnn({
    cell: lstm_cells,
    inputShape: rnn_input_shape,
    returnSequences: false
  }));

  model.add(tf.layers.dense({units: output_layer_neurons, inputShape: [output_layer_shape]}));

  model.compile({
    optimizer: tf.train.adam(learning_rate),
    loss: 'meanSquaredError'
  });

  const stats = await model.fit(xs, ys,
    { batchSize: rnn_batch_size, epochs: n_epochs, callbacks: {
      onEpochEnd: async (epoch, log) => {
        callback(epoch, log);
      }
    }
  });

  return { model: model, stats: stats };
}

inputs = inputs.slice(0, Math.floor(trainingsize / 100 * inputs.length));
outputs = outputs.slice(0, Math.floor(trainingsize / 100 * outputs.length));

let callback = function(epoch, log) {
  /* (epoch , log.loss) */
};

inputs = inputs.map((input, i) => {
  const min = Math.min(...input);
  const max = Math.max(...input);
  input = input.map(e => (e - min) / (max - min));
  outputs[i] = (outputs[i] - min) / (max - min);

  return input;
});

var results = await trainModel(inputs, outputs, windowsize, epochs, learningrate, hiddenlayers, callback);
stats = results.stats;

const modelpath = 'localstorage://timeseriesmodel';
await results.model.save(modelpath);

var model = {};
for (let i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  if (key.includes('timeseriesmodel/')) model[key] = localStorage.getItem(key);
}
