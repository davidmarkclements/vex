if (!('isNaN' in Number)) {
  Number.isNaN = function (value) { return value !== value; }
}