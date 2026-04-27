import { isNumber, isString, isObject, isEmpty, formatNumber } from '../index';

describe('isNumber', () => {
    test('should return true for valid numbers', () => {
        expect(isNumber(123)).toBe(true);
        expect(isNumber(123.45)).toBe(true);
        expect(isNumber(-123)).toBe(true);
        expect(isNumber(0)).toBe(true);
        expect(isNumber(Infinity)).toBe(true);
        expect(isNumber(-Infinity)).toBe(true);
    });

    test('should return false for non-numbers', () => {
        expect(isNumber('123')).toBe(false);
        expect(isNumber('abc')).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
        expect(isNumber({})).toBe(false);
        expect(isNumber([])).toBe(false);
        expect(isNumber(true)).toBe(false);
        expect(isNumber(false)).toBe(false);
        expect(isNumber(NaN)).toBe(false);
    });
});

describe('isString', () => {
    test('should return true for strings', () => {
        expect(isString('hello')).toBe(true);
        expect(isString('')).toBe(true);
        expect(isString('123')).toBe(true);
        expect(isString(String(123))).toBe(true);
    });

    test('should return false for non-strings', () => {
        expect(isString(123)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString({})).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString(true)).toBe(false);
        expect(isString(() => {})).toBe(false);
    });
});

describe('isObject', () => {
    test('should return true for plain objects', () => {
        expect(isObject({})).toBe(true);
        expect(isObject({ a: 1 })).toBe(true);
        expect(isObject(new Object())).toBe(true);
    });

    test('should return false for non-objects', () => {
        expect(isObject(null)).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject([])).toBe(false);
        expect(isObject(123)).toBe(false);
        expect(isObject('string')).toBe(false);
        expect(isObject(true)).toBe(false);
        expect(isObject(() => {})).toBe(false);
    });
});

describe('isEmpty', () => {
    test('should return true for empty values', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty('   ')).toBe(true);
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
    });

    test('should return false for non-empty values', () => {
        expect(isEmpty('hello')).toBe(false);
        expect(isEmpty('  hello  ')).toBe(false);
        expect(isEmpty([1, 2, 3])).toBe(false);
        expect(isEmpty({ a: 1 })).toBe(false);
        expect(isEmpty(0)).toBe(false);
        expect(isEmpty(false)).toBe(false);
        expect(isEmpty(true)).toBe(false);
    });

    test('should handle edge cases', () => {
        expect(isEmpty(123)).toBe(false);
        expect(isEmpty(0)).toBe(false);
        expect(isEmpty(false)).toBe(false);
        expect(isEmpty(NaN)).toBe(false);
        expect(isEmpty(Infinity)).toBe(false);
    });

    test('should handle nested empty structures', () => {
        expect(isEmpty({ a: {} })).toBe(false);
        expect(isEmpty({ a: [] })).toBe(false);
        expect(isEmpty({ a: '' })).toBe(false);
        expect(isEmpty({ a: null })).toBe(false);
    });

    test('should handle arrays with empty values', () => {
        expect(isEmpty([null])).toBe(false);
        expect(isEmpty([undefined])).toBe(false);
        expect(isEmpty([''])).toBe(false);
        expect(isEmpty([{}])).toBe(false);
        expect(isEmpty([[]])).toBe(false);
    });

    test('should handle functions and symbols', () => {
        expect(isEmpty(function () {})).toBe(false);
        expect(isEmpty(() => {})).toBe(false);
        expect(isEmpty(Symbol('test'))).toBe(false);
        expect(isEmpty(Symbol())).toBe(false);
    });

    test('should handle Map and Set objects', () => {
        expect(isEmpty(new Map())).toBe(false); // Map 不是 plain object
        expect(isEmpty(new Set())).toBe(false); // Set 不是 plain object
        expect(isEmpty(new Map([['key', 'value']]))).toBe(false);
        expect(isEmpty(new Set([1, 2, 3]))).toBe(false);
    });
});

describe('formatNumber', () => {
    test('should format numbers with default decimals', () => {
        expect(formatNumber(123)).toBe('123.00');
        expect(formatNumber(123.456)).toBe('123.46');
        expect(formatNumber(123.4)).toBe('123.40');
        expect(formatNumber(0)).toBe('0.00');
        expect(formatNumber(-123.456)).toBe('-123.46');
    });

    test('should format numbers with custom decimals', () => {
        expect(formatNumber(123.45678, 0)).toBe('123');
        expect(formatNumber(123.45678, 1)).toBe('123.5');
        expect(formatNumber(123.45678, 3)).toBe('123.457');
        expect(formatNumber(123.45678, 4)).toBe('123.4568');
    });

    test('should handle invalid inputs', () => {
        expect(formatNumber(NaN as any)).toBe('0');
        expect(formatNumber('not a number' as any)).toBe('0');
        expect(formatNumber(null as any)).toBe('0');
        expect(formatNumber(undefined as any)).toBe('0');
    });

    test('should round correctly', () => {
        expect(formatNumber(123.444, 2)).toBe('123.44');
        expect(formatNumber(123.445, 2)).toBe('123.45');
        expect(formatNumber(123.455, 2)).toBe('123.46');
    });

    test('should handle large and small numbers', () => {
        expect(formatNumber(123456789.123456, 2)).toBe('123456789.12');
        expect(formatNumber(0.000001, 6)).toBe('0.000001');
        expect(formatNumber(0.0000001, 6)).toBe('0.000000');
        expect(formatNumber(-123456789.123456, 2)).toBe('-123456789.12');
    });

    test('should handle decimal precision limits', () => {
        expect(formatNumber(123.456, 0)).toBe('123');
        expect(formatNumber(123.456, 10)).toBe('123.4560000000');
        expect(formatNumber(123.456, -1)).toBe('123'); // 负数精度应该被视为0
        // 由于浮点数精度问题，实际结果可能会有所不同
    // 123.456 在二进制浮点数中无法精确表示
    const result = formatNumber(123.456, 20);
    // 123.456 格式化为 20 位小数后，应该是 123.456 加上 20 位小数
    expect(result.startsWith('123.456')).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(23); // 至少 123.456 + 20位小数 = 23位
    expect(result.includes('.')).toBe(true); // 包含小数点
    });

  test('should handle extreme values', () => {
    expect(formatNumber(Infinity)).toBe('Infinity');
    expect(formatNumber(-Infinity)).toBe('-Infinity');
    expect(formatNumber(Number.MAX_SAFE_INTEGER, 0)).toBe('9007199254740991');
    expect(formatNumber(Number.MIN_SAFE_INTEGER, 0)).toBe('-9007199254740991');
  });

  test('should handle edge cases with rounding', () => {
    // 注意：由于浮点数精度问题，1.005 * 100 = 100.49999999999999，四舍五入为 100
    // 所以 1.005 格式化为 2 位小数是 '1.00' 而不是 '1.01'
    expect(formatNumber(0.005, 2)).toBe('0.01');
    expect(formatNumber(0.004, 2)).toBe('0.00');
    expect(formatNumber(1.005, 2)).toBe('1.00'); // 浮点数精度问题
    expect(formatNumber(1.004, 2)).toBe('1.00');
    expect(formatNumber(0.9995, 3)).toBe('1.000');
    expect(formatNumber(0.9994, 3)).toBe('0.999');
  });
});
