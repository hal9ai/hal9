export const plotimportcode = `
import io as hal9__io
import base64 as hal9__base64
import matplotlib.pyplot as hal9__plt
hal9__fig, hal9__ax = hal9__plt.subplots()
`;

export const plotexportcode = `hal9__buf = hal9__io.BytesIO()
hal9__fig.savefig(hal9__buf, format='png')
hal9__buf.seek(0)
plot = 'data:image/png;base64,' + hal9__base64.b64encode(hal9__buf.read()).decode('UTF-8')
`;

export function pyprecode(output) {
  var pyprecode = '';

  if (output.includes('stdout')) pyprecode = pyprecode  + '\n';
  if (output.includes('plot')) pyprecode = pyprecode + plotimportcode + '\n';
  
  return pyprecode;
}

export function pypostcode(output) {
  var pypostcode = '';

  if (output.includes('plot')) pypostcode = pypostcode + plotexportcode + '\n';
  if (output.includes('stdout')) pypostcode = pypostcode + '\n';
  
  return pypostcode;
}