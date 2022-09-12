/**
  input: [ data ]
  output: [ data, html ]
  params:
    - name: cameraType
      value:
        - control: select
          value: user
          values:
            - name: environment
              label: Environment
            - name: user
              label: User
  deps: [ 'https://unpkg.com/webcam-easy/dist/webcam-easy.min.js' ]
**/

data = hal9.get('frames');

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
  text.innerText = 'Click to Capture!'
  text.style.position = 'absolute';
  text.style.zIndex = 100;
  text.style.width = '100%';
  text.style.textAlign = 'center';
  html.appendChild(text);

  html.appendChild(canvas);
  html.appendChild(video);

  html.style.overflow = 'auto';

  const webcam = new Webcam(video, cameraType, canvas, null);

  html.onclick = function() {
    debugger;
    data = hal9.get('frames');
    data = data ? data : [];

    let picture = webcam.snap();

    data.push({ url: picture });
    hal9.set('frames', data);
  };

  webcam.start().catch(err => { alert(err); });
}
