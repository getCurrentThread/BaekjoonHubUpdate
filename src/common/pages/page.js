export default class BasePage {
  constructor(patterns = [], call_fn = null) {
    this.patterns = patterns;
    this.call_fn = call_fn;
  }
  /** if matched all patterns, return true
   * @param {string} url - url to test
   * @returns {boolean} - true if it matches
   */
  match(url) {
    if (this.patterns.length === 0) return true;
    for (const pattern of this.patterns) {
      // pattern type is string...
      if (typeof pattern === 'string') {
        if (!pattern.test(url)) return false;
      } else if (typeof pattern === 'function') {
        if (!pattern(url)) return false;
      } else {
        // throw exception
        throw new Error('Invalid pattern type');
      }
    }
    return true;
  }
  /** return callback functions
   * @returns {function} - callback function
   */
  get fn() {
    return this.call_fn;
  }
}
