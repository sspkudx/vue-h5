import { safeNum } from '../index';

describe('safeNum', () => {
    test('should convert valid number string to number', () => {
        expect(safeNum('123')).toBe(123);
        expect(safeNum('123.45')).toBe(123.45);
        expect(safeNum('-123')).toBe(-123);
    });

    test('should convert number to number', () => {
        expect(safeNum(123)).toBe(123);
        expect(safeNum(123.45)).toBe(123.45);
        expect(safeNum(-123)).toBe(-123);
        expect(safeNum(0)).toBe(0);
    });

    test('should return 0 for NaN values', () => {
        expect(safeNum('abc')).toBe(0);
        expect(safeNum('')).toBe(0);
        expect(safeNum('   ')).toBe(0);
        expect(safeNum(null)).toBe(0);
        expect(safeNum(undefined)).toBe(0);
        expect(safeNum({})).toBe(0);
        expect(safeNum([])).toBe(0);
        expect(safeNum(NaN)).toBe(0);
    });

    test('should handle boolean values', () => {
        expect(safeNum(true)).toBe(1);
        expect(safeNum(false)).toBe(0);
    });

    test('should handle arrays with single number', () => {
        expect(safeNum([123])).toBe(123); // Number([123]) converts to 123
        expect(safeNum(['123'])).toBe(123); // Number(['123']) converts to 123
        expect(safeNum([1, 2, 3])).toBe(0); // Number([1,2,3]) converts to NaN
        expect(safeNum([])).toBe(0); // Number([]) converts to 0
    });

    test('should handle objects', () => {
        expect(safeNum({ value: 123 })).toBe(0);
        expect(safeNum({ toString: () => '123' })).toBe(123);
    });

    test('should handle special numeric values', () => {
        expect(safeNum(Infinity)).toBe(Infinity);
        expect(safeNum(-Infinity)).toBe(-Infinity);
        expect(safeNum(Number.POSITIVE_INFINITY)).toBe(Infinity);
        expect(safeNum(Number.NEGATIVE_INFINITY)).toBe(-Infinity);
    });

    test('should handle scientific notation', () => {
        expect(safeNum('1.23e2')).toBe(123);
        expect(safeNum('1.23e-2')).toBe(0.0123);
        expect(safeNum('1e6')).toBe(1000000);
    });

    test('should handle hexadecimal and binary strings', () => {
        expect(safeNum('0xff')).toBe(255);
        expect(safeNum('0xFF')).toBe(255);
        expect(safeNum('0b1010')).toBe(10);
        expect(safeNum('0o755')).toBe(493);
    });

    test('should handle whitespace in numeric strings', () => {
        expect(safeNum('  123  ')).toBe(123);
        expect(safeNum('\t123\n')).toBe(123);
        expect(safeNum('123\r')).toBe(123);
    });

    test('should handle date objects', () => {
        const date = new Date('2024-01-01');
        expect(safeNum(date)).toBe(date.getTime());
    });
});
