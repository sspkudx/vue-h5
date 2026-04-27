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

    test('should support numeric separators', () => {
        // Numeric separators were added in Node 12
        const billion = 1_000_000_000;
        const hex = 0xff_ff_ff;
        const binary = 0b1010_0001;
        const octal = 0o7_7_7;

        expect(billion).toBe(1000000000);
        expect(hex).toBe(0xffffff);
        expect(binary).toBe(0b10100001);
        expect(octal).toBe(0o777);
    });

    test('should support String.prototype.replaceAll', () => {
        // String.prototype.replaceAll was added in Node 15
        // But should work in Node 14 with polyfill or transpilation
        const str = 'hello world world';
        const replaced = str.replaceAll('world', 'there');
        expect(replaced).toBe('hello there there');
    });

    test('should support logical assignment operators', () => {
        // Logical assignment operators were added in Node 15.0.0
        // But should work in Node 14 with transpilation
        let a = null;
        let b = 0;
        let c = false;
        let d = '';

        // OR logical assignment (||=)
        a ||= 'default';
        b ||= 42;

        // AND logical assignment (&&=)
        c &&= true;
        d &&= 'not empty';

        // Nullish coalescing assignment (??=)
        const obj: { x: string | null } = { x: null };
        obj.x ??= 'default';

        expect(a).toBe('default');
        expect(b).toBe(42); // 0 is falsy, so b ||= 42 sets b to 42
        expect(c).toBe(false); // false is falsy, so c &&= true doesn't change c
        expect(d).toBe(''); // empty string is falsy, so d &&= 'not empty' doesn't change d
        expect(obj.x).toBe('default');
    });

    test('should support Promise.any', async () => {
        // Promise.any was added in Node 15
        // This may not be available in Node 14, so we'll test if it exists
        if (typeof Promise.any === 'function') {
            const promises = [
                Promise.reject(new Error('error1')),
                Promise.resolve('success'),
                Promise.reject(new Error('error2')),
            ];

            const result = await Promise.any(promises);
            expect(result).toBe('success');
        } else {
            // Skip test if not supported
            console.log('Promise.any not available in Node 14, skipping test');
        }
    });

    test('should support Array.prototype.at', () => {
        // Array.prototype.at was added in Node 16
        // This may not be available in Node 14
        if (typeof Array.prototype.at === 'function') {
            const arr = [1, 2, 3, 4, 5];
            expect(arr.at(0)).toBe(1);
            expect(arr.at(-1)).toBe(5);
            expect(arr.at(2)).toBe(3);
        } else {
            // Skip test if not supported
            console.log('Array.prototype.at not available in Node 14, skipping test');
        }
    });

    test('should verify JavaScript version', () => {
        // Check ES2020 features availability
        const version = process.version;
        const major = parseInt(version.match(/v(\d+)\./)?.[1] || '0');

        console.log(`Current Node.js version: ${version}`);
        expect(major).toBeGreaterThanOrEqual(14);

        // Verify basic ES2020 features
        expect(typeof ''.replaceAll).toBe('function'); // Should be polyfilled if needed
        expect(typeof globalThis).toBe('object');
        expect(typeof Promise.allSettled).toBe('function');
    });
});
