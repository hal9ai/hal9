import { debuggerIf } from '../utils/debug'
import * as pycore from './pycore'

export default async function(script, header, context) {

  const params = header.params ? header.params.map(e => e.name) : [];
  const input = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  const debugcode = debuggerIf('interpret');

  var pyprecode = pycore.pyprecode(output);
  var pypostcode = pycore.pypostcode(output);

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
      self.pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/" });
    }

    ${jsconvertcode}
    ${inputcode}
    ${paramscode}
    ${importcode}

    await self.pyodide.runPythonAsync(\`${pyprecode}\n${pyconvertcode}\n${script}\n${pypostcode}\`)

    ${outputcode}
  `;

  header.deps = [
    'https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js?v=0.0.15',
    'https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js'
  ];

  return {
    script: interpreted,
    header: header
  };
}
