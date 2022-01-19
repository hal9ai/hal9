import { debuggerIf } from '../utils/debug'

export default function(script, header, context) {
  const input = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  const debugcode = debuggerIf('interpret');

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
  const importcode = header.deps && header.deps.length > 0 ? ("await self.pyodide.loadPackage([ " + header.deps.map(e => "'" + e + "'").join(', ') + " ]);\n") : '';

  const outputcode = output.map(e => e + " = self.pyodide.globals.get('" + e + "')").join('\n');

  const pyconvertcode = input.map(e => `if (hasattr(${e}, 'to_py')):
  ${e} = ${e}.to_py()
  `)

  const interpreted =  `
    ${debugcode}

    if (!self.pyodide) {
      self.pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.19.0/full/" });
    }

    ${jsconvertcode}
    ${inputcode}
    ${importcode}

    await self.pyodide.runPythonAsync(\`${pyconvertcode}\n ${script}\`)

    ${outputcode}
  `;

  header.deps = [
    'https://cdn.jsdelivr.net/npm/hal9-utils@0latest/dist/hal9-utils.min.js',
    'https://cdn.jsdelivr.net/pyodide/v0.19.0/full/pyodide.js'
  ];

  return {
    script: interpreted,
    header: header
  };
}
