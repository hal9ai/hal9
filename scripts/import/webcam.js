/**
  input: [ data ]
  output: [ data, html ]
  deps: [ 'https://unpkg.com/webcam-easy/dist/webcam-easy.min.js' ]
**/

data = data ? data : [];
var state = hal9.getState();
state = state ? state : [];
state.forEach(e => data.unshift(e));

if (html) {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 2;
  canvas.style = 'width: 2px;';

  var video = document.createElement('video');
  video.autoplay = true;
  video.setAttribute('playsinline', 'playsinline');
  video.width = html.offsetWidth;
  video.height = html.offsetHeight;

  var text = document.createElement('div');
  text.innerText = 'Click to classify!'
  text.style.position = 'absolute';
  text.style.zIndex = 100;
  text.style.width = '100%';
  text.style.textAlign = 'center';
  html.appendChild(text);

  html.appendChild(canvas);
  html.appendChild(video);

  html.style.overflow = 'auto';

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
