/**
  input: [ data ]
  params:
    - name: file
      label: 'File'
      value:
        - control: 'fileload'
          links:
            - name: 'url'
              label: 'Insert link'
            - name: 'file'
              label: 'Load file'
          selected: 'url'
          fileExt: '.mp4'
  output: [ data, html ]
  deps: [ 'https://cdn.jsdelivr.net/npm/arquero@latest' ]
  cache: session
**/

data = data ? data : [];
let state = hal9.getState();
state = state ? state : [];
state.forEach(e => data.unshift(e));

if (html) {
  // video
  let video = document.createElement('video');
  video.setAttribute('playsinline', 'playsinline');
  video.width = html.offsetWidth;
  video.height = html.offsetHeight;
  video.controls = 'controls';

  // canvas
  let canvas = document.createElement('canvas');
  canvas.width = 1166;
  canvas.height = 501;
  canvas.style = 'width: 2px;';

  // image snap
  let saveImage = document.createElement('button');
  saveImage.innerText = 'Save Image';
  saveImage.onclick = function () {
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    let dataURL = canvas.toDataURL('image/jpeg');
    data = hal9.getState();
    data = data ? data : [];
    data.push({ url: dataURL });
    hal9.setState(data);
    hal9.invalidate();
  }

  html.appendChild(saveImage);
  html.appendChild(canvas);
  html.appendChild(video);
  html.style.overflow = 'auto';

  if (file) {
    video.src = file;
  }
}
