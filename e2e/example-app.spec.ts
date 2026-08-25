import { expect, test } from '@playwright/test';

/**
 * example-app 冒烟测试（H5 移动端 viewport）
 * @description 覆盖首页渲染、workspace 包联调结果、hash 路由导航、SFC 计数器交互
 */

test('首页渲染标题与 @my-app/shared 联调结果', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('欢迎使用 vue-h5 模板')).toBeVisible();
    // workspace 包联调：safeNum 合法输入转数字、非法输入兜底 0
    await expect(page.getByText("safeNum('123') = 123")).toBeVisible();
    await expect(page.getByText("safeNum('abc') = 0")).toBeVisible();
});

test('hash 路由：点击「关于」跳转到 About 页面', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '关于' }).click();
    await expect(page).toHaveURL(/\/#\/about$/);
    await expect(page.getByText('这是关于页面（示例）')).toBeVisible();
});

test('hash 路由：点击「Playground」跳转并完成计数器交互', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Playground' }).click();
    await expect(page).toHaveURL(/\/#\/playground$/);
    await expect(page.getByText('当前计数：0')).toBeVisible();
    await page.getByRole('button', { name: '+1' }).click();
    await page.getByRole('button', { name: '+1' }).click();
    await expect(page.getByText('当前计数：2')).toBeVisible();
});
