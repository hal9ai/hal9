HTMLWidgets.widget({
  name: 'hal9',
  type: 'output',
  factory: function(el, width, height) {
    el.parentElement.style.height = "100%";
    el.parentElement.style.maxHeight = "100%";
    el.style.padding = '4px';

    if (height === 0) el.style.height = '380px';

    return {

      renderValue: function(x) {
        window.hal9 = {
          pipeline: x.pipeline_json
        };

        const html = `<div id="app" style="height: 800px; max-height: 800px;"></div>`;
        el.innerHTML = html;

        const script = document.createElement('script');
        script.src = x.library;
        document.body.appendChild(script);
      },

      resize: function(width, height) {
      }
    };
  }
});
