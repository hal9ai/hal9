HTMLWidgets.widget({
  name: 'hal9',
  type: 'output',
  factory: function(el, width, height) {
    el.parentElement.style.height = "100%";
    el.parentElement.style.maxHeight = "100%";
    el.style.overflow = 'hidden';

    if (height === 0) el.style.height = '380px';

    return {

      renderValue: function(x) {
        const css = `
          #output {
            display: flex;
            flex-direction: column;
          }
        `;

        const render = function() {
          hal9.init({ iframe: true, html: el, api: x.library, css: css }, {}).then(function(hal9) {
            hal9.load(x.pipeline_json).then(function(pid) {
              hal9.run(pid, { html: 'output', shadow: false, editable: true });
            });
          });
        }

        if (typeof(hal9) == 'undefined') {
          const script = document.createElement('script');
          script.id = 'hal9-script';
          script.src = x.library;
          document.body.appendChild(script);

          script.addEventListener('load', function() {
            render()
          });
        }
        else {
          render();
        }
      },

      resize: function(width, height) {
      }
    };
  }
});
