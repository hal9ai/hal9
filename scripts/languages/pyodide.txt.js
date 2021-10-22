/**
  deps: [ 'https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js' ]
**/

await languagePluginLoader;
self.pyodide.loadPackage(['numpy']);

data = await self.pyodide.runPythonAsync(`

import numpy as np

np.arange(15).reshape(3, 5)

`)
