import { describe, expect, test } from 'vitest';
import { createApp } from 'vue';
import { authPlugin } from '../src';

describe('authPlugin', () => {
    test('should install $auth on globalProperties', () => {
        const app = createApp({});
        app.use(authPlugin, { tokenKey: 'test-token' });
        const auth = app.config.globalProperties.$auth;
        expect(auth).toBeDefined();
        auth.setToken('abc');
        expect(auth.getToken()).toBe('abc');
        auth.clearToken();
        expect(auth.getToken()).toBe(null);
    });
});
