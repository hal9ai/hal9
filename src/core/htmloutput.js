const getOutputDiv = () => {
  return document.getElementById('output');
}

export const getScrollWidth = () => {
  return getOutputDiv().scrollWidth;
}

export const setScrollLeft = (pixels) => {
  getOutputDiv().scrollLeft = pixels;
}

export const getScrollHeight = () => {
  return getOutputDiv().scrollHeight;
}

export const setScrollTop = (pixels) => {
  getOutputDiv().scrollTop = pixels;
}
