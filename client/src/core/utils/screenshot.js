import { loadScriptObject } from './scriptloader';

const canvasToBlob = async (canvas) => {
  return await new Promise((success, failure) => {
    canvas.toBlob(blob => {
      success(blob);
    });
  });
}

export const resize = async (sourceImageData, width, height) => {
  const wrapper = document.createElement('div');

  document.body.appendChild(wrapper);

  var destinationImage = new Image;
  const resizeWait = new Promise((success, failure) => {
    destinationImage.onload = function() {
      const resized = document.createElement('canvas');
      resized.style.position = 'absolute';
      resized.style.zIndex = -10;
      resized.style.filter = 'opacity(0)';
      resized.style.top = 0;
      
      height = height ? height : Math.floor(width * destinationImage.height / destinationImage.width);
      resized.width = width;
      resized.height = height;

      wrapper.appendChild(resized);

      var destCanvas = resized;

      //copy canvas by DataUrl
      var destCanvasContext = destCanvas.getContext('2d');

      destCanvasContext.drawImage(destinationImage, 0, 0, destinationImage.width, destinationImage.height, 0, 0, width, height);
      
      const result = canvasToBlob(resized);
      success(result);
    };
  });
  destinationImage.src = sourceImageData;
  const result = await resizeWait;

  wrapper.remove();

  return result;
}

function toDataURL(src, callback){
  return new Promise(function(accept, reject) {
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function(){
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      context.drawImage(this, 0, 0);
      var dataURL = canvas.toDataURL('image/jpeg');
      accept(dataURL);
    };
    image.onerror = reject;
    image.src = src;
  });
}

const captureInt = async (output, options = {}) => {
  output = typeof(output) == 'string' ? document.getElementById('output') : output;
  var html2canvas = await loadScriptObject('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas');
  
  const wrapper = document.createElement('div');

  document.body.appendChild(wrapper);

  const elems = [...(output.shadowRoot ? output.shadowRoot.children : output.children)];
  const total = elems.length == 0 ? 0 : elems.map(e => e.querySelectorAll("*").length).reduce((a,b) => a + b);

  // cloning too many HTML elements can block the browser
  var copies = [];
  if (total <= 5000)
    copies = elems.map(e => e.cloneNode(true));

  const copy = document.createElement('div');
  
  if (options.area !== 'auto') {
    copy.style.width = output.offsetWidth + 'px';
    copy.style.height = output.offsetHeight + 'px';
  }

  copy.style.position = 'absolute';
  copy.style.top = 0;
  copy.style.zIndex = -10;
  copy.style.filter = 'opacity(0)';
  for (let e of copies) {
    for (let img of [...e.querySelectorAll('img')]) {
      if (options.safe) {
        img.src = '';
        continue;
      }

      var image = new Image();
      image.src = await toDataURL(img.src);

      for (let style in img.style) {
        try { image.style[style] = img.style[style]; } catch (e) {};
      }

      img.parentElement.insertBefore(image, img);
      img.remove();
    }
    if (options.safe) {
      if (e.nodeName.toLowerCase() == 'iframe') {
        continue;
      }
    }
    copy.appendChild(e);
  }
  wrapper.appendChild(copy);

  var canvas = await html2canvas(copy, {
    allowTaint: true,
    taintTest: false
  });

  canvas.style.position = 'absolute';
  canvas.style.zIndex = -10;
  canvas.style.filter = 'opacity(0)';
  canvas.style.top = 0;

  wrapper.appendChild(canvas);

  if (options.width && options.height) {
    var sourceImageData = sourceCanvas.toDataURL("image/png");
    return await resize(sourceImageData, options.width, options.height);
  }
  else {
    return await canvasToBlob(canvas)
  }
}

export const capture = async (output, options = {}) => {
  try {
    return await captureInt(output, options);
  }
  catch(e) {
    console.log('Failed to gnerate image, trying safe mode: ' + e);
    try {
      return await captureInt(output, Object.assign(options, {
        safe: true
      }));
    }
    catch(e) {
      console.log('Failed to gnerate image in safe mode: ' + e);
      return '';
    }
  }
}
