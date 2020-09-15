// Warn if overriding existing method
if (Array.prototype.equals)
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  )
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array) return false

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false
    } else if (this[i] !== array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false })

function roundDP (val, dp) {
  const mul = Math.pow(10, dp)
  return Math.round(val * mul) / mul
}

function countDecimals (val) {
  if (Math.floor(val) === val) return 0
  const s = val.toString().split('.')[1]
  return s ? s.length : 0
}

function gramToOz (val) {
  return val / 28.34952
}

function mlToGallon (val) {
  return val / 3785
}

function ozToGram (val) {
  return val * 28.34952
}

function gallonToMl (val) {
  return val * 3785
}

const metricToImperial = {
  gram: val => [gramToOz(val), 'oz'],
  mL: val => [mlToGallon(val), 'gallon']
}

const imperialToMetric = {
  oz: val => [ozToGram(val), 'gram'],
  gallon: val => [gallonToMl(val), 'mL']
}

function convertUnit (val, unit, toImperial, dp = 1) {
  let conversionMap = toImperial ? metricToImperial : imperialToMetric
  if (unit in conversionMap) {
    let res = conversionMap[unit](val)
    res[0] = roundDP(res[0], dp)
    return res
  }
  return [val, unit]
}

function isMatchQuery (word, query) {
  return word.toLowerCase().includes(query.toLowerCase())
}

function matchQueryAt (word, query) {
  return word.toLowerCase().indexOf(query.toLowerCase())
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function mapFromIterable (arr, keyId = null) {
  return arr.reduce((res, item) => {
    res[keyId !== null ? item[keyId] : item] = item
    return res
  }, {})
}

function isStr(s) {
  return typeof(s) === 'string' || s instanceof String;
}

export {
  matchQueryAt,
  isMatchQuery,
  roundDP,
  countDecimals,
  convertUnit,
  sleep,
  mapFromIterable,
  isStr
}
export default {
  matchQueryAt,
  isMatchQuery,
  roundDP,
  countDecimals,
  convertUnit,
  sleep,
  mapFromIterable,
  isStr
}
