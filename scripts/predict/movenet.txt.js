/**
  params:
    - name: images
      label: Images
    - name: model
      label: Model
      value:
        - control: select
          value: thunder
          values:
            - name: lightning
              label: Lightning
            - name: thunder
              label: Thunder
            - name: blaze
              label: Blaze
  deps:
    - https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core
    - https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter
    - https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl
    - https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

if (images) {
  data = await hal9.utils.toRows(data);
  
  var detector = null;
  if (model == 'lightning') {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);

  }
  else if (model == 'blaze') {
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: 'tfjs',
      modelType: 'full'
    };

    detector = await poseDetection.createDetector(model, detectorConfig);
  }
  else {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER });
  }

  async function urlToImageData(url) {
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

        const imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        accept(imgdata);
      };
      img.onerror = (e) => reject(e.message);
    });

    img.src = url;
    return await wait;
  }

  async function createSegments (idx, image) {
    
    var imgdata = await urlToImageData(image);

    const poses = await detector.estimatePoses(imgdata);
    var total = poses.length;
    result = total > 0 ? poses[0].keypoints : null;
    data[idx] = Object.assign(data[idx], { people: total, keypoints: result });
  }

  await Promise.all(data.map((e, idx) => createSegments(idx, e[images])))

}
  data.map(value =>{
    value.keypoints.map(keypoint =>{
      keypoint.x = keypoint.x - 300;  
    })
  })

