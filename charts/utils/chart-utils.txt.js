const isDate = str => {
  if(str.toString() === parseFloat(str).toString()) return false;

  const tryDate = new Date(str);
  const strTryDate = tryDate.toString();

  return (tryDate && strTryDate !== 'NaN' && strTryDate !== 'Invalid Date');
};

const convert = x => {
  if (typeof(x) === 'string') {
    if (isDate(x)) {
      return new Date(x);
    }
    else {
      var maybenum = x.replace(/,/g, '');
      return isNaN(maybenum) ? x : parseFloat(maybenum);
    }
  } else {
    return x === null ? NaN : x;
  }
};

const wrapper = root => {
  const div = document.createElement('div');
  div.style.flexGrow = 1;
  div.style.overflow = 'hidden';

  root.appendChild(div);
  root.style.display = 'flex';

  return div;
}

const groupBy = (values, key) =>
  values.reduce((res, v) => {
    res[v[key]] = res[v[key]] || [];
    res[v[key]].push(v);

    return res;
  }, {});

const createLegend = ({ names, colors, values }) => {
  const legendDiv = document.createElement('div');

  legendDiv.style.display = 'flex';
  legendDiv.style.position = 'absolute';
  legendDiv.style.right = '1em';
  legendDiv.style['font-size'] = '0.85em';
  legendDiv.style['max-width'] = '90%';
  legendDiv.style.overflow = 'auto';

  if (names && colors) {
    names.forEach((name, i) => {
      const legendItem = document.createElement('div');

      legendItem.style.display = 'flex';
      legendItem.style['align-items'] = 'center';
      legendItem.style['margin-right'] = '1em';

      legendItem.innerHTML = `
        <span style="background: ${colors[i % colors.length]}; width: 1em; height: 1em; margin-right: 0.5em"></span>
        ${name}
      `;
      legendDiv.appendChild(legendItem);
    });
  }

  return legendDiv;
};
