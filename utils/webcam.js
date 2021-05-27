/**
  input: []
  output: [ html ]
  deps: [ 'https://unpkg.com/webcam-easy/dist/webcam-easy.min.js' ]
**/

data = data ? data : [];
var state = hal9.getState();
state = state ? state : [];
state.forEach(e => data.push(e));

if (html) {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 2;
  canvas.style = 'width: 2px;';

  var video = document.createElement('video');
  video.autoplay = true;
  video.setAttribute('playsinline', 'playsinline');
  video.width = '100';
  video.height = '100';

  html.appendChild(canvas);
  html.appendChild(video);

  html.style.overflow = 'auto';
  for (let i = data.length - 1; i >= 0 ; i--) {
    var img = document.createElement('img');
    img.src = data[i].url;
    img.width = img.height = 100;
    html.appendChild(img);
  }

  const webcam = new Webcam(video, 'environment', canvas);

  html.onclick = function() {
   
    data = hal9.getState();
    data = data ? data : [];

    let picture = webcam.snap();

    data.push({ url: picture });
    hal9.setState(data);
    hal9.invalidate();
  };

  webcam.start().catch(err => { console.log(err); });
}
