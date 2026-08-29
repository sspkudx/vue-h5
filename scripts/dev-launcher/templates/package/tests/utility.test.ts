import { describe, expect, test } from 'vitest';
import { isNumber, isString, safeNum, isEmpty, formatNumber } from '../src';

describe('safeNum', () => {
    test('should convert valid input to number', () => {
        expect(safeNum('123')).toBe(123);
        expect(safeNum('123.45')).toBe(123.45);
        expect(safeNum(123)).toBe(123);
        expect(safeNum(true)).toBe(1);
    });

    test('should return 0 for invalid input', () => {
        expect(safeNum('abc')).toBe(0);
        expect(safeNum(null)).toBe(0);
        expect(safeNum(undefined)).toBe(0);
        expect(safeNum(NaN)).toBe(0);
    });
});

describe('type guards', () => {
    test('isNumber', () => {
        expect(isNumber(1)).toBe(true);
        expect(isNumber('1')).toBe(false);
        expect(isNumber(NaN)).toBe(false);
    });

    test('isString', () => {
        expect(isString('')).toBe(true);
        expect(isString(1)).toBe(false);
    });
});

describe('isEmpty', () => {
    test('empty values', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
    });

    test('non-empty values', () => {
        expect(isEmpty('x')).toBe(false);
        expect(isEmpty([1])).toBe(false);
        expect(isEmpty({ a: 1 })).toBe(false);
        expect(isEmpty(0)).toBe(false);
    });
});

describe('formatNumber', () => {
    test('should format with default decimals', () => {
        expect(formatNumber(123)).toBe('123.00');
        expect(formatNumber(123.456)).toBe('123.46');
    });

    test('should handle custom decimals', () => {
        expect(formatNumber(123.456, 0)).toBe('123');
        expect(formatNumber(123.45678, 3)).toBe('123.457');
    });

    test('should handle invalid input', () => {
        expect(formatNumber(NaN)).toBe('0');
    });
});
