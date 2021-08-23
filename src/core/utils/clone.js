import rfdc from 'rfdc'
const clone = rfdc();

export default function(x) {
  return clone(x);
}
