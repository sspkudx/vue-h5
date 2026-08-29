// @vitest-environment jsdom
import { describe, expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import { Button } from '../src';

describe('Button', () => {
    test('should render with default type', () => {
        const wrapper = mount(Button, { slots: { default: '点击' } });
        expect(wrapper.text()).toBe('点击');
        expect(wrapper.classes()).toContain('btn');
        expect(wrapper.classes()).toContain('btn-primary');
    });

    test('should render secondary type', () => {
        const wrapper = mount(Button, { props: { type: 'secondary' }, slots: { default: '次级' } });
        expect(wrapper.classes()).toContain('btn-secondary');
    });

    test('should emit click event', async () => {
        const wrapper = mount(Button);
        await wrapper.trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
    });
});
