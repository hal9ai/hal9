HTMLWidgets.widget({
  name: 'hal9',
  type: 'output',
  factory: function(el, width, height) {
    return {

      renderValue: function(x) {
        window.hal9 = {
          data: x.data,
          pipeline: x.pipeline_json
        };

        const html = `<div id="app" style="height: 800px; max-height: 800px;"></div>`;
        el.innerHTML = html;

        const script = document.createElement('script');
        script.src = 'https://hal9.com/hal9.notebook.js';
        document.body.appendChild(script);
      },

      resize: function(width, height) {
      }
    };
  }
});
