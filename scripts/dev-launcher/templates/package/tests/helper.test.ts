import { describe, expect, test } from 'vitest';
import { isValidEmail, isValidPhone } from '../src';

describe('isValidPhone', () => {
    test('should accept valid phone numbers', () => {
        expect(isValidPhone('13800138000')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
        expect(isValidPhone('12345')).toBe(false);
        expect(isValidPhone('23800138000')).toBe(false);
    });
});

describe('isValidEmail', () => {
    test('should accept valid emails', () => {
        expect(isValidEmail('a@b.com')).toBe(true);
    });

    test('should reject invalid emails', () => {
        expect(isValidEmail('a@b')).toBe(false);
        expect(isValidEmail('a b@c.com')).toBe(false);
    });
});
