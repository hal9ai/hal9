export const debugIf = (flag) => {
  if (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug && window.hal9.debug[flag]) {
    debugger;
  }

  if (typeof(window) != 'undefined' && window.hal9cfg && window.hal9cfg.debug && window.hal9cfg.debug[flag]) {
    debugger;
  }
}