/**
  params:
    - name: images
      label: Images
    - name: model
      label: Model
      value:
        - control: select
          value: MobileNetV1
          values:
            - name: MobileNetV1
              label: MobileNetV1
            - name: ResNet50
              label: ResNet50
  deps:
    - https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.2
    - https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

if (images) {
  data = await hal9.utils.toRows(data);
    async function loadNet(model) {
      if (model === 'MobileNetV1') {
          const net = await bodyPix.load({
              architecture: 'MobileNetV1',
              outputStride: 16,
              multiplier: 0.75,
              quantBytes: 2
          });
          return net;
      } else {
          const net = await bodyPix.load({
              architecture: 'ResNet50',
              outputStride: 32,
              quantBytes: 2
          });
          return net;
      }
  }

  const net = await loadNet(model);
  const mode = 'partsSegmentation'
  const person = 'multiPerson'
  async function segment (image, mode, person) {
      if (person === 'singlePerson') {
          if (mode == 'personSegmentation') {
              const segmentation = await net.segmentPerson(image, {
                  flipHorizontal: false,
                  internalResolution: 'medium',
                  segmentationThreshold: 0.7
              });
              return segmentation;
          } else {
              const segmentation = await net.segmentPersonParts(image, {
                  flipHorizontal: false,
                  internalResolution: 'medium',
                  segmentationThreshold: 0.7
              });
              return segmentation;
          }
      } else {
          if (mode == 'personSegmentation') {
              const segmentation = await net.segmentMultiPerson(image, {
                  flipHorizontal: false,
                  internalResolution: 'medium',
                  segmentationThreshold: 0.7,
                  maxDetections: 10,
                  scoreThreshold: 0.2,
                  nmsRadius: 20,
                  minKeypointScore: 0.3,
                  refineSteps: 10
              });
              return segmentation;
          } else {
              const segmentation = await net.segmentMultiPersonParts(image, {
                  flipHorizontal: false,
                  internalResolution: 'medium',
                  segmentationThreshold: 0.7,
                  maxDetections: 10,
                  scoreThreshold: 0.2,
                  nmsRadius: 20,
                  minKeypointScore: 0.3,
                  refineSteps: 10
              });
              return segmentation;
          }
      }
  }

  async function urlToCanvas(url) {
    var img = new Image;

    var wait = new Promise((accept, reject) => {
      img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.position = 'absolute';
        canvas.style.display = 'none';

        html.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);
        accept(canvas);
      };
      img.onerror = (e) => reject(e.message);
    });

    img.src = url;
    return await wait;
  }

  async function createSegments (idx, image, mode, person) {
    var canvas = await urlToCanvas(image);
    var result = await segment(canvas, mode, person);
    canvas.remove();

    var total = Object.keys(result).length;
    result = total > 0 ? result[0].pose : null;
    data[idx] = Object.assign(data[idx], { People: total, Parts: result });
  }

  await Promise.all(data.map((e, idx) => createSegments(idx, e[images], mode, person)))

}