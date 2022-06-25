/**
  description: Stops pipeline execution when the 'if' expression is true.
  input: []
  output: []
  params:
    - name: expression
      description: A JavaScript expression, which may use the 'outputs' dictionary which references outputs produced by previous steps by name.
      label: 'If'
      value:
        - control: textbox
**/

const outputs = hal9.getOutputs();
var ifexpression = new Function('outputs', 'return ' + expression + ';');

if (ifexpression(outputs) === true) hal9.stop();
