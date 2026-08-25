// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import PlaygroundPage from './PlaygroundPage.vue';

/**
 * SFC 组件测试示例（P2 应用级测试）
 * @description 演示 .vue 单文件组件在 Vitest + jsdom 环境下的挂载与交互测试
 */
describe('PlaygroundPage（计数器演示页）', () => {
    test('渲染初始计数 0', () => {
        const wrapper = mount(PlaygroundPage);
        expect(wrapper.text()).toContain('当前计数：0');
    });

    test('点击 +1 按钮后计数递增', async () => {
        const wrapper = mount(PlaygroundPage);
        const button = wrapper.find('button');
        await button.trigger('click');
        await button.trigger('click');
        expect(wrapper.text()).toContain('当前计数：2');
    });
});
