export default (hexColor, magnitude) => {
  hexColor = hexColor.replace(`#`, ``);
  if (hexColor.length === 6) {
    const decimalColor = parseInt(hexColor, 16);
    let r = (decimalColor >> 16) + magnitude;
    // tslint:disable-next-line: no-unused-expression
    r > 255 && (r = 255);
    // tslint:disable-next-line: no-unused-expression
    r < 0 && (r = 0);
    let g = (decimalColor & 0x0000ff) + magnitude;
    // tslint:disable-next-line: no-unused-expression
    g > 255 && (g = 255);
    // tslint:disable-next-line: no-unused-expression
    g < 0 && (g = 0);
    let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
    // tslint:disable-next-line: no-unused-expression
    b > 255 && (b = 255);
    // tslint:disable-next-line: no-unused-expression
    b < 0 && (b = 0);
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  } else {
    return hexColor;
  }
};
