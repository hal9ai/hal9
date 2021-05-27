/**
  params:
    - sma
    - name: window
      label: Window Size
      value:
        - control: range
          value: 20
          min: 1
          max: 100
**/

if (!Array.isArray(sma)) sma = sma ? [ sma ] : [];

let sums = sma.map(e => 0.00);

for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < sma.length; j++) {
    sums[j] += parseFloat(data[i][sma[j]]);
    if (i - window >= 0) sums[j] -= parseFloat(data[i - window][sma[j]]);

    data[i]['sma' + sma[j]] = sums[j] / Math.min(window, i + 1);
  }
}
