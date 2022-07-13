/**
  params:
    - filter
    - name: start
      label: Start
      value:
        - control: range
          value: 0
          min: 0
          max: 100
    - name: end
      label: End
      value:
        - control: range
          value: 100
          min: 0
          max: 100
  deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js' ]
**/

start = start == undefined ? 0 : parseFloat(start);
end = end == undefined ? 100 : parseFloat(end);

if (!filter) {
  const rowStart = start / 100 * data.length;
  const rowEnd = (100 - end) / 100 * data.length;
  data = data.splice(rowStart, data.length - rowEnd)
}
else {
  const min = d3.min(data, e => parseFloat(e[filter]));
  const max = d3.max(data, e => parseFloat(e[filter]));
  const valStart = (max - min) * start / 100;
  const valEnd = (max - min) * end / 100;
  data = data.filter(e => {
    return parseFloat(e[filter]) >= valStart && parseFloat(e[filter]) <= valEnd
  })
}