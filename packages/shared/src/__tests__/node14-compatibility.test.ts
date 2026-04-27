describe('Node 14 compatibility', () => {
    test('should support optional chaining', () => {
        // Optional chaining was added in Node 14
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = { a: { b: { c: 1 } } };
        expect(obj?.a?.b?.c).toBe(1);
        expect(obj?.a?.b?.d).toBeUndefined();
        expect(obj?.x?.y).toBeUndefined();
    });

    test('should support nullish coalescing', () => {
        // Nullish coalescing was added in Node 14
        const value1 = null ?? 'default';
        const value2 = undefined ?? 'default';
        const value3 = 0 ?? 'default';
        const value4 = false ?? 'default';
        const value5 = '' ?? 'default';

        expect(value1).toBe('default');
        expect(value2).toBe('default');
        expect(value3).toBe(0); // 0 is not null or undefined
        expect(value4).toBe(false); // false is not null or undefined
        expect(value5).toBe(''); // empty string is not null or undefined
    });

    test('should support Promise.allSettled', () => {
        // Promise.allSettled was added in Node 12.9.0/13.0.0
        const promises = [Promise.resolve('success'), Promise.reject(new Error('failure'))];

        return Promise.allSettled(promises).then(results => {
            expect(results).toHaveLength(2);
            expect(results[0]).toEqual({ status: 'fulfilled', value: 'success' });
            expect(results[1]).toEqual({ status: 'rejected', reason: expect.any(Error) });
        });
    });

    test('should support String.matchAll', () => {
        // String.matchAll was added in Node 12
        const regex = /test(\d?)/g;
        const string = 'test1 test2 test';
        const matches = Array.from(string.matchAll(regex));

        expect(matches).toHaveLength(3);
        expect(matches[0][0]).toBe('test1');
        expect(matches[0][1]).toBe('1');
    });

    test('should support BigInt', () => {
        // BigInt was added in Node 10.4.0
        const bigIntValue = 1234567890123456789012345678901234567890n;
        expect(typeof bigIntValue).toBe('bigint');
        expect(bigIntValue.toString()).toBe('1234567890123456789012345678901234567890');
    });

    test('should support globalThis', () => {
        // globalThis was added in Node 12
        expect(globalThis).toBeDefined();
        expect(globalThis.setTimeout).toBeDefined();
    });
});
