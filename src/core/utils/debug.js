const shoudDebug = (flag) => {
  if (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug && window.hal9.debug[flag]) {
    return true;
  }

  if (typeof(window) != 'undefined' && window.hal9cfg && window.hal9cfg.debug && window.hal9cfg.debug[flag]) {
    return true;
  }

  return false;
}

export const debugIf = (flag) => {
  if (shoudDebug(flag)) {
    debugger;
  }
}

export const debuggerIf = (flag) => {
  return shoudDebug(flag) ? 'debugger;\n' : '';
}
