export default (value) => {
  let v = value;
  if (v.length === 1) {
    v = '0' + v;
  }
  v = parseFloat(v.replace(/[^\d]/g, '').replace(/(\d\d?)$/, '.$1')).toFixed(2);
  return v;
};
