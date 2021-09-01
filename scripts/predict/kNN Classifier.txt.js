/**
  input:
    - train
    - data
  params:
    - name: label
      label: Label
    - name: k
      label: k
      value:
        - control: 'number'
          value: 3
          lazy: true
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/@tensorflow/tfjs
    - https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
  cache: true
**/
if (label) {
    tf.disposeVariables();
    label = train.array(label);
    classifier = knnClassifier.create();
    trainSet = train.select(aq.not(label))
    for (var i = 0; i < train.numRows(); i++) {
        classifier.addExample(tf.tensor(Object.values(trainSet.object(i))), genre[i]);
    }
    predictions = [];
    confidences = [];
    if (data.columnNames().includes(label[0])) {
      var test = data.select(aq.not(label));
    } else {
      var test = data;
    }
    for (var i = 0; i < test.numRows(); i++) {
      const input = tf.tensor(Object.values(test.object(i)));
      const output = await classifier.predictClass(input, k = k) 
      predictions.push(output.label)
      confidences.push(output.confidences)
    }
    data = data.assign({Prediction: predictions});
    data = data.assign({Confidences: confidences})
    if (data.columnNames().includes(label)) {
      data = data.relocate(['Prediction', 'Confidences'], {after: label});
    }
    classifier.dispose();
  }