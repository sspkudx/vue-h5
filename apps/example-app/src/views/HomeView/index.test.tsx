// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import HomeView from './index';

/**
 * TSX（defineComponent）组件测试示例
 * @description 演示 .tsx 组件挂载 + vue-router 依赖 mock + workspace 包（@my-app/shared）联调
 */

// 路由依赖 mock：组件内 useRouter() 返回 { push: mock }
vi.mock('vue-router', () => ({
    useRouter: () => ({ push: pushMock }),
}));

const pushMock = vi.fn();

describe('HomeView（首页，TSX + workspace 包联调）', () => {
    beforeEach(() => {
        pushMock.mockClear();
    });

    test('渲染 safeNum 联调结果（合法输入转数字、非法输入兜底 0）', () => {
        const wrapper = mount(HomeView);
        expect(wrapper.text()).toContain("safeNum('123') = 123");
        expect(wrapper.text()).toContain("safeNum('abc') = 0");
    });

    test('点击「关于」按钮调用 router.push("/about")', async () => {
        const wrapper = mount(HomeView);
        const buttons = wrapper.findAll('button');
        await buttons[0].trigger('click');
        expect(pushMock).toHaveBeenCalledWith('/about');
    });

    test('点击「Playground」按钮调用 router.push("/playground")', async () => {
        const wrapper = mount(HomeView);
        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');
        expect(pushMock).toHaveBeenCalledWith('/playground');
    });
});
