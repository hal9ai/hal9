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

export const capture = async (output, options = {}) => {
  output = typeof(output) == 'string' ? document.getElementById('output') : output;
  var html2canvas = await loadScriptObject('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'html2canvas');
  
  const wrapper = document.createElement('div');

  document.body.appendChild(wrapper);

  const elems = [...(output.shadowRoot ? output.shadowRoot.children : output.children)];
  const total = elems.map(e => e.querySelectorAll("*").length).reduce((a,b) => a + b);

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
  copies.forEach(e => copy.appendChild(e));
  wrapper.appendChild(copy);

  var canvas = await html2canvas(copy);
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
