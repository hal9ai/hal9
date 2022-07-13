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
          pipeline: x.pipeline_json,
          iframe: x.iframe,
          id: 'hal9-root-' + Math.floor(Math.random() * 10000000)
        };

        const id = x.environment != 'prod' ? window.hal9.id : 'app';

        const html = `<div id="${window.hal9.id}" style="height: 800px; max-height: 800px;"></div>`;
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
