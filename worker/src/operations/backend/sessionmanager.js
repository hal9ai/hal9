
var sessionMap = {};

export const get = (id) => {
  return sessionMap[id];
}

export const set = (id, session) => {
  sessionMap[id] = session;
}
