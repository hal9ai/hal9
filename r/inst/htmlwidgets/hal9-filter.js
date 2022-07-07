HTMLWidgets.widget({
  name: 'hal9-filter',
  type: 'output',
  factory: function(el, width, height) {
    return {

      renderValue: function(x) {
        window.hal9 = {
          data: x.data,
          pipeline: {
            "steps": [
              {
                "name": "filter",
                "label": "Filter",
                "language": "javascript",
                "description": "Keep only the rows that satisfy a given expression for a specific column",
                "icon": "fa-light fa-filter",
                "id": 1,
                "params": {}
              }
            ],
            "params": {
              "1": {
                "field": {
                  "id": 0,
                  "static": false,
                  "value": [
                    {
                      "id": 0,
                      "name": "",
                      "label": ""
                    }
                  ],
                  "name": "field",
                  "label": "Field",
                  "single": true
                },
                "expression": {
                  "id": 1,
                  "static": true,
                  "value": [
                    {
                      "control": "textbox",
                      "value": "field != null",
                      "id": 1
                    }
                  ],
                  "name": "expression",
                  "label": "Expression"
                }
              }
            },
            "outputs": {},
            "scripts": {
              "1": "/**\n  params:\n    - name: field\n      label: Field\n      single: true\n    - name: expression\n      label: 'Expression'\n      value:\n        - control: 'textbox'\n          value: field != null\n  deps:\n    - https://cdn.jsdelivr.net/npm/arquero@latest\n    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js\n**/\ndata = await hal9.utils.toArquero(data);\n\nif (expression && field) {\n  var filterexp = new Function('field', 'return ' + expression);\n  data = data.params({field}).filter(aq.escape((data, $)=> filterexp(data[$.field])));\n}"
            },
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
