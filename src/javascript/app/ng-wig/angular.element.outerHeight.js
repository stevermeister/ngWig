/**
 * No box-sizing, such a shame
 *
 * 1.Calculate outer height
 * @param   bool    Include margin
 * @returns Number  Height in pixels
 *
 * 2. Set outer height
 * @param   Number          Height in pixels
 * @param   bool            Include margin
 * @returns angular.element Collection
 */
if (typeof angular.element.prototype.outerHeight !== 'function') {

angular.element.prototype.outerHeight = function() {
  function parsePixels(cssString) {
    if (cssString.slice(-2) === 'px') {
      return parseFloat(cssString.slice(0, -2));
    }
    return 0;
  }

  var includeMargin = false, height, $element = this.eq(0), element = $element[0];

  if (arguments[0] === true || arguments[0] === false || arguments[0] === undefined) {
    if (!$element.length) {
      return 0;
    }

    includeMargin = arguments[0] && true || false;

    if (element.outerHeight) {
      height = element.outerHeight;
    } else {
      height = element.offsetHeight;
    }
    if (includeMargin) {
      height += parsePixels($element.css('marginTop')) + parsePixels($element.css('marginBottom'));
    }
    return height;

  } else {
    if (!$element.length) {
      return this;
    }

    height = parseFloat(arguments[0]);

    includeMargin = arguments[1] && true || false;

    if (includeMargin) {
      height -= parsePixels($element.css('marginTop')) + parsePixels($element.css('marginBottom'));
    }

    height -= parsePixels($element.css('borderTopWidth')) + parsePixels($element.css('borderBottomWidth')) +
        parsePixels($element.css('paddingTop')) + parsePixels($element.css('paddingBottom'));

    $element.css('height', height + 'px');
    return this;
  }
};

}
