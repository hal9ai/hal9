
export default function(script, header, context) {
  const input = header.input ? header.input : [];
  const output = header.output ? header.output : [ 'data' ];

  const inputcode = input.map(e => "self.pyodide.globals.set('" + e + "', " + e + ");").join('\n');
  const importcode = header.deps && header.deps.length > 0 ? ("await self.pyodide.loadPackage([ " + header.deps.map(e => "'" + e + "'").join(', ') + " ]);\n") : '';

  const outputcode = output.map(e => e + " = self.pyodide.globals.get('" + e + "')").join('\n');

  const interpreted =  `
    if (!self.pyodide) {
      self.pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.19.0/full/" });
    }

    ${inputcode}
    ${importcode}

    await self.pyodide.runPythonAsync(\`${script}\`)

    ${outputcode}
  `;

  header.deps = [ 'https://cdn.jsdelivr.net/pyodide/v0.19.0/full/pyodide.js' ];

  return {
    script: interpreted,
    header: header
  };
}
