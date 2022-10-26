import { sha1 } from 'sha1';

export default class Util {
  /**
   *현재 익스텐션의 버전정보를 반환합니다.
   * @returns {string} - 현재 익스텐션의 버전정보
   */
  static getVersion() {
    // eslint-disable-next-line no-undef
    return chrome.runtime.getManifest().version;
  }

  /** element가 존재하는지 반환합니다.
   * @param {DOMElement} element - 존재하는지 확인할 element
   * @returns {boolean} - 존재하면 true, 존재하지 않으면 false
   */
  static elementExists(element) {
    return element !== undefined && element !== null && element.length > 0;
  }

  /**
   * 해당 값이 null 또는 undefined인지 체크합니다.
   * @param {any} value - 체크할 값
   * @returns {boolean} - null이면 true, null이 아니면 false
   */
  static isNull(value) {
    return value === null || value === undefined;
  }

  /**
   * 해당 값이 비어있거나 빈 문자열인지 체크합니다.
   * @param {any} value - 체크할 값
   * @returns {boolean} - 비어있으면 true, 비어있지 않으면 false
   */
  static isEmpty(value) {
    // eslint-disable-next-line no-prototype-builtins
    return Util.isNull(value) || value.length === 0;
  }

  /** 객체 또는 배열의 모든 요소를 재귀적으로 순회하여 값이 비어있지 않은지 체크합니다.
   * 자기 자신의 null값이거나 빈 문자열, 빈 배열, 빈 객체인 경우이거나, 요소 중 하나라도 값이 비어있으면 false를 반환합니다.
   * @param {any} obj - 체크할 객체 또는 배열
   * @returns {boolean} - 비어있지 않으면 true, 비어있으면 false
   */
  static isNotEmpty(obj) {
    if (Util.isEmpty(obj)) return false;
    if (typeof obj !== 'object') return true;
    if (obj.length === 0) return false;
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        if (!Util.isNotEmpty(obj[key])) return false;
      }
    }
    return true;
  }
  /**
   * 문자열을 escape 하여 반환합니다.
   * @param {string} text - escape 할 문자열
   * @returns {string} - escape된 문자열
   */
  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  /** 문자열을 escape 하여 반환합니다. */
  // String.prototype.escapeHtml = function () {
  //   return escapeHtml(this);
  // };

  /**
   * escape된 문자열을 unescape하여 반환합니다.
   * @param {string} text - unescape할 문자열
   * @returns {string} - unescape된 문자열
   */
  static unescapeHtml(text) {
    const unescaped = {
      '&amp;': '&',
      '&#38;': '&',
      '&lt;': '<',
      '&#60;': '<',
      '&gt;': '>',
      '&#62;': '>',
      '&apos;': "'",
      '&#39;': "'",
      '&quot;': '"',
      '&#34;': '"',
      '&nbsp;': ' ',
      '&#160;': ' ',
    };
    return text.replace(
      /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160);/g,
      function (m) {
        return unescaped[m];
      },
    );
  }

  /** 문자열을 unescape 하여 반환합니다. */
  // String.prototype.unescapeHtml = function () {
  //   return unescapeHtml(this);
  // };

  /** 일반 특수문자를 전각문자로 변환하는 함수
   * @param {string} text - 변환할 문자열
   * @returns {string} - 전각문자로 변환된 문자열
   */
  static convertSingleCharToDoubleChar(text) {
    // singleChar to doubleChar mapping
    const map = {
      '!': '！',
      '%': '％',
      '&': '＆',
      '(': '（',
      ')': '）',
      '*': '＊',
      '+': '＋',
      ',': '，',
      '-': '－',
      '.': '．',
      '/': '／',
      ':': '：',
      ';': '；',
      '<': '＜',
      '=': '＝',
      '>': '＞',
      '?': '？',
      '@': '＠',
      '[': '［',
      '\\': '＼',
      ']': '］',
      '^': '＾',
      _: '＿',
      '`': '｀',
      '{': '｛',
      '|': '｜',
      '}': '｝',
      '~': '～',
      ' ': ' ', // 공백만 전각문자가 아닌 FOUR-PER-EM SPACE로 변환
    };
    // eslint-disable-next-line no-useless-escape
    return text.replace(/[!%&()*+,\-./:;<=>?@\[\\\]^_`{|}~ ]/g, function (m) {
      return map[m];
    });
  }

  /**
   * base64로 문자열을 base64로 인코딩하여 반환합니다.
   * @param {string} str - base64로 인코딩할 문자열
   * @returns {string} - base64로 인코딩된 문자열
   */
  static b64EncodeUnicode(str) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(`0x${p1}`);
      }),
    );
  }

  /**
   * base64로 인코딩된 문자열을 base64로 디코딩하여 반환합니다.
   * @param {string} b64str - base64로 인코딩된 문자열
   * @returns {string} - base64로 디코딩된 문자열
   */
  static b64DecodeUnicode(b64str) {
    return decodeURIComponent(
      atob(b64str)
        .split('')
        .map(function (c) {
          return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
        })
        .join(''),
    );
  }

  /** key 값을 기준으로 array를 그룹핑하여 map으로 반환합니다.
   * @param {object} array - array to be sorted
   * @param {string} key - key to sort
   * @returns {object} - key 기준으로 그룹핑된 객체들 배열을 value로 갖는 map
   */
  static groupBy(array, key) {
    return array.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  /**
   * arr에서 같은 key 그룹 내의 요소 중 최고의 값을 리스트화하여 반환합니다.
   * @param arr: 비교할 요소가 있는 배열
   * @param key: 같은 그룹으로 묶을 키 값
   * @param compare: 비교할 함수
   * @returns {array<object>} : 같은 key 그룹 내의 요소 중 최고의 값을 반환합니다.
   * */
  static maxValuesGroupBykey(arr, key, compare) {
    const map = Util.groupBy(arr, key);
    const result = [];
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(map)) {
      const maxValue = value.reduce((max, current) => {
        return compare(max, current) > 0 ? max : current;
      });
      result.push(maxValue);
    }
    return result;
  }

  /** 배열 내의 key에 val 값을 포함하고 있는 요소만을 반환합니다.
   * @param {array} arr - array to be filtered
   * @param {string} key - key to filter
   * @param {string} val - value to filter
   * @returns {array} - filtered array
   */
  static filter(arr, key, val) {
    return arr.filter(function (item) {
      return val.includes(item[key]);
    });
  }
  /** calculate github blob file SHA
   * @param {string} content - file content
   * @returns {string} - SHA hash
   */
  static calculateBlobSHA(content) {
    return sha1(`blob ${new Blob([content]).size}\0${content}`);
  }

  /**
   * combine two array<Object> same index.
   * @param {array<Object>} a
   * @param {array<Object>} b
   * @return {array<Object>}
   */
  static combine(a, b) {
    return a.map((x, i) => Object.assign({}, x, b[i]));
  }

  /**
   * asyncPool https://github.com/rxaviers/async-pool/blob/master/lib/es7.js
   * @param {number} poolLimit - pool limit
   * @param {array} array - array to be processed
   * @param {function} iteratorFn - iterator function
   * @returns {array} - processed array
   */
  static async asyncPool(poolLimit, array, iteratorFn) {
    const ret = [];
    const executing = [];
    for (const item of array) {
      const p = Promise.resolve().then(() => iteratorFn(item, array));
      ret.push(p);

      if (poolLimit <= array.length) {
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= poolLimit) {
          await Promise.race(executing);
        }
      }
    }
    return Promise.all(ret);
  }
}