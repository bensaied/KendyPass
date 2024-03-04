function getRandomByte() {
  // http://caniuse.com/#feat=getrandomvalues
  if (window.crypto && window.crypto.getRandomValues) {
    let result = new Uint8Array(1);
    window.crypto.getRandomValues(result);
    return result[0];
  } else if (window.msCrypto && window.msCrypto.getRandomValues) {
    let result = new Uint8Array(1);
    window.msCrypto.getRandomValues(result);
    return result[0];
  } else {
    return Math.floor(Math.random() * 256);
  }
}

function generate(length, upperCase, lowerCase, numbers, symbols) {
  let ch = "^[";
  if (lowerCase) ch += "a-z";
  if (upperCase) ch += "A-Z";
  if (symbols) ch += "@#$%^&+*!=(){}()|";
  if (numbers) ch += "0-9";
  ch += "]";
  const pattern = new RegExp(ch, "g");
  return Array.apply(null, { length: length })
    .map(function () {
      let result;
      while (true) {
        result = String.fromCharCode(getRandomByte());
        if (pattern.test(result)) {
          return result;
        }
      }
    }, this)
    .join("");
}
export default generate;
