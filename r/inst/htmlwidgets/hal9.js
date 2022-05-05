HTMLWidgets.widget({
  name: 'hal9',
  type: 'output',
  factory: function(el, width, height) {
    return {

      renderValue: function(x) {
        /**
         * Object.entriesFrom() polyfill
         * @author Chris Ferdinandi
         * @license MIT
         */
        if (!Object.fromEntries) {
        	Object.fromEntries = function (entries){
        		if (!entries || !entries[Symbol.iterator]) { throw new Error('Object.fromEntries() requires a single iterable argument'); }
        		let obj = {};
        		for (let [key, value] of entries) {
        			obj[key] = value;
        		}
        		return obj;
        	};
        }

        window.hal9 = {
          data: [ { "number": 1 }, { "number": 2 } ],
          pipeline: {
            "steps": [ { "name": "javascript", "label": "Source", "language": "javascript", "id": 1, } ],
            "params": {}, "outputs": {}, "scripts": { "1": "data = window.hal9.data" },
            "version": "0.0.1"
          }
        };

        const html = `<div id="app" style="height: 420px; max-height: 420px;"></div>`;
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
