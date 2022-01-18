const settings = {
  table: {
    rowLookAhead: 10,
    imageLookAhead: 2,
  },
  maxLevels: 20
};

function createElem(parentEl, type, className) {
  var el = document.createElement(type);
  el.className = className;
  parentEl.appendChild(el);
  return el;
}

function createTable(parentEl, className) {
  var table = createElem(parentEl, 'table', className);
  table.border = table.cellSpacing = table.cellPadding = '0';
  return table;
}

function createTableElem(parentEl, className) {
  var tdEl = createElem(parentEl, 'td', className);
  return createElem(tdEl, 'div', 'jedit-table-entry-wrap');
}

function createTableNavElem(parentEl, right, isrow, className, onclick) {
  var tdEl = createElem(parentEl, 'td', 'jedit-table-nav ' + className);
  if (!isrow) {
    var arrow = createElem(tdEl, 'div', right ? 'jedit-table-nav-right' : 'jedit-table-nav-left');
    arrow.addEventListener('click', onclick);
  }
  return tdEl
}

function isTable(json) {
  if (!Array.isArray(json) || json.length <= 0) return false;
  const rowKeys = function(e) { return JSON.stringify(Object.keys(e)); }

  if (['undefined', 'string'].includes(typeof(json[0])) || Object.keys(json[0]).length === 0) return false;

  const lookAhead = Math.min(settings.table.rowLookAhead, json.length);
  for (var i = 1; i < lookAhead; i++) {
    if (rowKeys(json[i]) != rowKeys(json[0])) {
      return false;
    }
  }

  return true;
}

function isArquero(json) {
  return json && typeof(json.columnNames) === 'function';
}

function isDanfo(json) {
  return json && typeof(json.col_data_tensor) === 'object';
}

function isPyodide(json) {
  return json && json.type === 'DataFrame';
}

async function fetchTimeout(resource, options, timeout) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

async function guessType(json) {
  if (typeof(json) === 'string' && json.startsWith('data:image/')) {
    return 'image';
  }
  else if (typeof(json) === 'string' && /^https?:\/\/.*jpe?g$/.test(json)) {
    return 'image';
  }
  else if (typeof(json) === 'string' && (json.startsWith('http://') || json.startsWith('https://'))) {
    try {
      const response = await fetchTimeout(json, {
        method: 'HEAD',
        redirect: 'follow'
      }, 1000);

      if (response.headers.get("Content-Type").startsWith('image/')) {
        return 'image';
      }
    }
    catch (error) {
      console.log(error);
    }

    return 'link';
  }
  
  return undefined;
}


async function getTableTypes(json) {
  const lookAhead = Math.min(settings.table.rowLookAhead, json.length);
  var types = {};

  var keys = Object.keys(json[0]);

  var promises = [];
  var guesses = {};

  const guessTypeStore = async function(json, guesses, i, key) {
    if (!guesses[i]) guesses[i] = {};
    guesses[i][key] = await guessType(json[i][key])
  };

  for (var i = 0; i < lookAhead; i++) {
    for (var idxCol in keys) {
      const key = keys[idxCol];
      promises.push(guessTypeStore(json, guesses, i, key));
    }
  }

  await Promise.all(promises);

  for (var i = 0; i < lookAhead; i++) {
    for (var idxCol in keys) {
      const key = keys[idxCol];
      const type = guesses[i][key];
      if (i == 0) types[key] = type;
      else if (type != undefined && type != types[key]) types[key] = undefined;
    }
  }

  return types;
}

function appendTableRows(tableEl, json, types, keys, max, start, colStart, colEnd) {
  var total = 0;
  var idxRow = start;
  while (idxRow < json.length) {
    var row = json[idxRow];
    var rowEl = createElem(tableEl, 'tr', 'jedit-table-row');
    var rowClass = 'jedit-table-row-entry ' + (idxRow % 2 == 0 ? 'jedit-even' : 'jedit-odd');

    createTableNavElem(rowEl, false, true, rowClass + (colStart > 0 ? '' : ' jedit-hide'));
    for (var idxCol = colStart; idxCol <= colEnd; idxCol++) {
      const key = keys[idxCol];
      var headEntryEl = createTableElem(rowEl, rowClass);
      buildHtml(headEntryEl, json[idxRow][key], max - 1, types[key]);
    }
    createTableNavElem(rowEl, true, true, rowClass + (colEnd < keys.length - 1 ? '' : ' jedit-hide'));

    idxRow++;
    total++;
    if (total >= 100) {
      break;
    }
  }

  if (idxRow < json.length) {
    var moreRowEl = createElem(tableEl, 'tr', 'jedit-table-row jedit-table-more');
    var moreEleEl = createElem(moreRowEl, 'td', 'jedit-table-row-entry jedit-table-more');
    moreEleEl.colSpan = (colEnd - colStart) + 1;
    moreEleEl.style.textAlign = 'center';
    moreEleEl.innerText = 'Load more';
    moreEleEl.style.cursor = 'pointer';
    moreEleEl.onclick = function() {
      var last = tableEl.children[tableEl.children.length - 1];
      last.remove();
      appendTableRows(tableEl, json, types, keys, max, idxRow, colStart, colEnd);
    }
  }
}

async function buildTable(parentEl, json, max, colStart) {
  if (json.length == 0) {
    parentEl.innerHTML = 'No results :(';
    parentEl.className = 'jedit-table-empty';
    return;
  }

  var tableEl = createTable(parentEl, 'jedit-table');
  var keys = Object.keys(json[0]);

  const visibleCols = 10;
  colStart = colStart == undefined ? 0 : Math.min(Math.max(0, colStart), keys.length - 1);
  var colEnd = Math.min(colStart + visibleCols - 1, keys.length - 1);

  var headerEl = createElem(tableEl, 'tr', 'jedit-table-header');
  createTableNavElem(headerEl, false, false, 'jedit-table-row-entry' + (colStart > 0 ? '' : ' jedit-hide'), function() {
    parentEl.innerHTML = '';
    buildTable(parentEl, json, max, colStart - visibleCols);
  });

  for (var idxCol = colStart; idxCol <= colEnd; idxCol++) {
    var headEntryEl = createTableElem(headerEl, 'jedit-table-row-entry');
    buildHtml(headEntryEl, keys[idxCol], max - 1, null);
  }

  createTableNavElem(headerEl, true, false, 'jedit-table-row-entry' + (colEnd < keys.length - 1 ? '' : ' jedit-hide'), function() {
    parentEl.innerHTML = '';
    buildTable(parentEl, json, max, colStart + visibleCols);
  });

  const types = await getTableTypes(json);

  appendTableRows(tableEl, json, types, keys, max, 0, colStart, colEnd);
}

function buildArray(parentEl, json, max) {
  if (json.length == 0) {
    buildString(parentEl, '[]', max);
    return;
  }

  var tableEl = createTable(parentEl, 'jedit-object-table');

  for (var index in json) {
    var rowEl = createElem(tableEl, 'tr', 'jedit-object-row');
    var rowValueEl = createElem(rowEl, 'td', 'jedit-object-value');

    buildHtml(rowValueEl, json[index], max - 1, null);
  }
}

function buildString(parentEl, json, max) {
  var divKeyEl = createElem(parentEl, 'div', 'jedit-contained jedit-string');
  divKeyEl.innerText = json;
}

function buildRootString(parentEl, json, max) {
  var divKeyEl = createElem(parentEl, 'div', 'jedit-contained jedit-string');
  divKeyEl.style.minHeight = '100%';
  divKeyEl.style.overflowY = 'auto';
  divKeyEl.innerText = json;
}

function buildLink(parentEl, json, max) {
  var divKeyEl = createElem(parentEl, 'a', 'jedit-contained jedit-link');
  divKeyEl.href = json;
  divKeyEl.target = 'blank';
  divKeyEl.innerText = json;
}

function buildArquero(parentEl, table, max) {
  var subset = table.slice(0, Math.min(500, table.numRows()));
  var rows = [];
  subset.scan(function(i, data) {
    const row = Object.fromEntries(Object.keys(data).map(e => [e, data[e].get(i)]));
    rows.push(row);
  }, true);

  buildTable(parentEl, rows, max);
}

async function buildDanfo(parentEl, table, max) {
  var rows = JSON.parse(await table.head(500).to_json())

  buildTable(parentEl, rows, max);
}

async function buildPyodide(parentEl, table, max) {
  var rows = JSON.parse(table.to_json(undefined, 'records'))

  buildTable(parentEl, rows, max);
}

function buildImage(parentEl, json, max) {
  var linkEl = createElem(parentEl, 'a', 'jedit-image-link');
  linkEl.href = json;
  linkEl.target = "_blank";
  var imgEl = createElem(linkEl, 'img', (settings.maxLevels == max ? 'jedit-full' : 'jedit-contained') + ' jedit-image');
  imgEl.src = json;
}

function appendObjectRows(tableEl, json, max, start, end) {
  for (var idx = start; idx < end && idx < Object.keys(json).length; idx++) {
    var key = Object.keys(json)[idx];
    var rowEl = createElem(tableEl, 'tr', 'jedit-object-row');

    var rowKeyEl = createElem(rowEl, 'td', 'jedit-object-key');
    rowKeyEl.innerText = key;

    var rowValueEl = createElem(rowEl, 'td', 'jedit-object-value');

    buildHtml(rowValueEl, json[key], max - 1, null);
  }

  if (end < Object.keys(json).length) {
    var rowEl = createElem(tableEl, 'tr', 'jedit-object-row');

    var moreEleEl = createElem(rowEl, 'td', 'jedit-object-key');
    moreEleEl.setAttribute('colspan', 2);
    moreEleEl.innerText = 'Load More';

    moreEleEl.style.cursor = 'pointer';
    moreEleEl.onclick = function() {
      var last = tableEl.children[tableEl.children.length - 1];
      last.remove();
      appendObjectRows(tableEl, json, max, end, end + 20);
    }
  }
}

function buildObject(parentEl, json, max) {
  if (Object.keys(json).length == 0) {
    buildUnknown(parentEl, json, max);
    return;
  }

  var tableEl = createTable(parentEl, 'jedit-object-table');
  appendObjectRows(tableEl, json, max, 0, 20);
}

function buildBoolean(parentEl, json, max) {
  var divKey = createElem(parentEl, 'div', 'jedit-contained jedit-boolean');
  divKey.innerText = json.toString();
}

function buildUnknown(parentEl, json, max) {
  var divKey = createElem(parentEl, 'div', 'jedit-contained jedit-unknown');
  divKey.innerText = json !== undefined && json !== null ? json.toString() : 'null';
}

async function buildHtml(parentEl, json, max, type, root) {
  if (max < 0) return;

  if (!type) {
    type = 'unknown';
    if (isArquero(json)) type = 'arquero';
    else if (isPyodide(json)) type = 'pyodide';
    else if (isDanfo(json)) type = 'danfo';
    else if (isTable(json)) type = 'table';
    else if (Array.isArray(json) && json.length > 0 && typeof(json[0]) != 'object') type = 'array';
    else if (typeof(json) === 'string') {
      type = json.startsWith('data:image/') ? 'image' : 'string';
    }
    else if (typeof(json) === 'boolean') type = 'boolean';
    else if (typeof(json) === 'object' && json !== null) type = 'object';
  }

  const typeDispatch = {
    table: buildTable,
    array: buildArray,
    string: root === true ? buildRootString : buildString,
    object: buildObject,
    boolean: buildBoolean,
    unknown: buildUnknown,
    image: buildImage,
    link: buildLink,
    arquero: buildArquero,
    danfo: buildDanfo,
    pyodide: buildPyodide,
  }

  await typeDispatch[type](parentEl, json, max);
}

export async function build(parentEl, json) {
  await buildHtml(parentEl, json, settings.maxLevels, undefined, true);
}
