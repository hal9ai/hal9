import { debuggerIf } from '../utils/debug'

export default async function(script, header, context) {

  const params = header.params ? header.params.map(e => e.name) : [];
  const input = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  const debugcode = debuggerIf('interpret');

  var plotimportcode = `
import io as hal9__io
import base64 as hal9__base64
import matplotlib.pyplot as hal9__plt
hal9__fig, hal9__ax = hal9__plt.subplots()

class Capture(list):
  def __enter__(self):
    import sys
    from io import StringIO 
    self._stdout = sys.stdout
    sys.stdout = self._stringio = StringIO()
    return self
  def __exit__(self, *args):
    import sys
    self.extend(self._stringio.getvalue().splitlines())
    del self._stringio
    sys.stdout = self._stdout
hal9__log = Capture().__enter__()
`;

  var plotexportcode = `hal9__buf = hal9__io.BytesIO()
hal9__fig.savefig(hal9__buf, format='png')
hal9__buf.seek(0)
plot = 'data:image/png;base64,' + hal9__base64.b64encode(hal9__buf.read()).decode('UTF-8')
`;

  var prepycode = `
class Capture(list):
  def __enter__(self):
    import sys
    from io import StringIO 
    self._stdout = sys.stdout
    sys.stdout = self._stringio = StringIO()
    return self
  def __exit__(self, *args):
    import sys
    self.extend(self._stringio.getvalue().splitlines())
    del self._stringio
    sys.stdout = self._stdout
hal9__log = Capture().__enter__()
`;

  var postpycode = `
hal9__log.__exit__()
log = '\\\\n'.join(hal9__log)
`;

  if (!output.includes('plot')) {
    plotimportcode = plotexportcode = '';
  }

  const jsconvertcode = `
  function convertToPyType(rows) {
    return rows.map(row => {
      Object.keys(row).forEach(key => {
        if (Object.prototype.toString.call(row[key]) === '[object Date]')
          row[key] = row[key].getTime() / 1000;
      });

      return row;
    });
  }

  async function convertToPy(e) {
    return hal9.utils.isArquero(e) ? convertToPyType(await hal9.utils.toRows(e)) : e;
  }`;

  const inputcode = input.map(e => "self.pyodide.globals.set('" + e + "', await convertToPy(" + e + "));").join('\n');
  const paramscode = params.map(e => "self.pyodide.globals.set('" + e + "', " + e + ");").join('\n');


  const pyimports = header.deps ? header.deps : [];
  if (!pyimports.includes('matplotlib'))
    pyimports.push('matplotlib');
  const importcode = "await self.pyodide.loadPackage([ " + header.deps.map(e => "'" + e + "'").join(', ') + " ]);\n";

  const outputcode = output.map(e => e + " = self.pyodide.globals.get('" + e + "')").join('\n');

  const pyconvertcode = input.map(e => `if (hasattr(${e}, 'to_py')):
  ${e} = ${e}.to_py()
  `).join('\n');

  const interpreted =  `
    ${debugcode}

    if (!self.pyodide) {
      self.pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/" });
    }

    ${jsconvertcode}
    ${inputcode}
    ${paramscode}
    ${importcode}

    await self.pyodide.runPythonAsync(\`${prepycode}${plotimportcode}\n${pyconvertcode}\n${script}\n${plotexportcode}${postpycode}\`)

    ${outputcode}
  `;

  header.deps = [
    'https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js?v=0.0.15',
    'https://cdn.jsdelivr.net/pyodide/v0.19.1/full/pyodide.js?v=0.19.1'
  ];

  return {
    script: interpreted,
    header: header
  };
}
