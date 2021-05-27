/**
  input:
    - data
    - model
  params:
    - window
    - name: prediction
      label: Prediction
    - name: predictions
      label: Predictions
      value:
        - control: range
          value: 0
          min: 0
          max: 100
  cache: true
**/

if (!Array.isArray(window)) window = [ window ];
if (!model) throw('Prediction requires previous step to train a model');

for (var key in model) {
  localStorage.setItem(key, model[key]);
}

const modelpath = 'localstorage://timeseriesmodel';

model = await tf.loadLayersModel(modelpath);

function normalize(win) {
    const min = Math.min(...win);
    const max = Math.max(...win);
    return win.map(e => (e - min) / (max - min));
};

function denormalize(win, min, max) {
    return win.map(e => (e * (max - min)) + min);
};

var newData = [];

for (var winidx = 0; winidx < window.length; winidx ++) {
  var winsrc = window[winidx];

  const predictedResults = model.predict(
    tf.tensor2d(
      data.map(e => normalize(e[winsrc])),
      [ data.length, data[0][winsrc].length ]
    )
  );

  const results = Array.from(await predictedResults.dataSync());

  var min = 0;
  var max = 0;
  data = data.map((e, i) => {
    const win = e[winsrc];
    min = Math.min(...win);
    max = Math.max(...win);
    
    var pred = {}
    pred['prediction' + winsrc] = (results[i] * (max - min)) + min;

    return Object.assign(e, pred);
  });

  var futureWindow = data[data.length - 1][winsrc];
  futureWindow.splice(0, 1);
  futureWindow.push(data[results.length - 1][prediction]);

  var futureWindowNorm = normalize(futureWindow);
  min = Math.min(...futureWindow);
  max = Math.max(...futureWindow);

  for (var idx = 0; idx < predictions; idx++) {
    var futurePrediction = model.predict(tf.tensor2d([ normalize(futureWindowNorm) ], [ 1, futureWindowNorm.length ]));
    var futureResults = Array.from(await futurePrediction.dataSync());

    const denormalized = (futureResults[0] * (max - min)) + min;

    var futureRow = Object.fromEntries(Object.keys(data[data.length - 1]).map(e => [e, null]));

    if (newData.length <= idx) {
      var pred = { }
      pred[winsrc] = denormalize(futureWindowNorm);
      pred['prediction' + winsrc] = denormalized;

      newData.push(Object.assign(futureRow, pred));
    }
    else {
      newData[idx][winsrc] = denormalize(futureWindowNorm);
      newData[idx]['prediction' + winsrc] = denormalized;
    }

    futureDenormalizedWindow = denormalize(futureWindowNorm, min, max);
    futureDenormalizedWindow.splice(0, 1);
    futureDenormalizedWindow.push(denormalized);

    min = Math.min(...futureDenormalizedWindow);
    max = Math.max(...futureDenormalizedWindow);

    futureWindowNorm = normalize(futureDenormalizedWindow);
  }
}

for (var idx = 0; idx < newData.length; idx++) {
  data.push(newData[idx]);
}