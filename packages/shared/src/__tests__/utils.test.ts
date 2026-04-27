import { 
    isNumber, 
    isString, 
    isObject, 
    isEmpty,
    formatNumber 
} from '../index';

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
});