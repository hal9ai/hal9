/**
  input: [ 'data' ]
  output: [ 'data', 'html' ]
  params:
      - name: site
        label: Website URL
        value:
          - control: textbox
            lazy: true
            value: https://hal9ai.github.io/hal9ai/examples/website.html
**/

data = typeof(data) != 'undefined' ? JSON.parse(JSON.stringify(data)) : null;

const iframe = document.createElement('iframe');
iframe.classList.add('app-layout-initial-width-900px');

var waitForOutput = false;

const inputListener = event => {
  if (!event.data || !event.data.hal9) return;
  
  if (event.data.hal9 == 'input') {
    iframe.contentWindow.postMessage({ hal9: 'input', input: { data: data } }, '*');

    if (event.data.options && event.data.options.wait) {
      waitForOutput = !!event.data.options.wait;  
    }
  }
}
window.addEventListener('message', inputListener);

var outputListener = null
const outputWaiter = new Promise((accept, reject) => {
  outputListener = event => {
    if (!event.data || !event.data.hal9) return;

    if (event.data.hal9 == 'output' && event.data.output) {
      accept(event.data.output);
    }
  }
  window.addEventListener('message', outputListener);
})

iframe.style.border = 0;
iframe.style.width = '100%';
iframe.style.height = '100%';

iframe.src = site;

const loadWaiter = new Promise((accept, reject) => {
  iframe.addEventListener("load", function() {
    accept()
  });
  iframe.addEventListener("error", function(e) {
    reject(e)
  });
})

html.appendChild(iframe);
await loadWaiter

// wait for input messages since they are async
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
await sleep(100)

if (waitForOutput) {
  const output = await outputWaiter;
  if (output.data) data = output.data;
}

const interactiveListener = event => {
  if (!event.data || !event.data.hal9) return;
  
  if (event.data.hal9 == 'output' && event.data.output) {
    var state = hal9.getState();
    state = Object.assign(state, event.data.output);
    hal9.setState(state);
    hal9.invalidate();
  }
}


window.addEventListener('message', interactiveListener);

var observer = new MutationObserver(function (e) {
  if (e.filter(e => e.removedNodes && e.removedNodes[0] == html).length > 0) {
    window.removeEventListener('message', inputListener);
    window.removeEventListener('message', outputListener);
    window.removeEventListener('message', interactiveListener);
  }
});
observer.observe(html.parentNode, { childList: true });
