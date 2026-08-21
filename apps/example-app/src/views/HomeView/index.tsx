import { defineComponent } from 'vue';
import { safeNum } from '@my-app/shared';
import styles from './style.module.less';

/**
 * 首页示例组件
 * @description 展示 workspace 包（@my-app/shared）的源码联调效果：
 * safeNum 将入参安全转换为数字，非法输入兜底为 0
 */
const HomeView = defineComponent({
    name: 'HomeView',
    setup() {
        const render = () => {
            // 示例数据：合法字符串与非法字符串，验证 safeNum 的转换与兜底
            const validInput = '123';
            const invalidInput = 'abc';
            const validNum = safeNum(validInput);
            const invalidNum = safeNum(invalidInput);

            return (
                <div class={styles.homeView}>
                    <p class={styles.homeView__text}>首页</p>
                    <p class={[styles.homeView__text, styles.homeView__text_gray]}>欢迎使用 vue-h5 模板</p>
                    <div>
                        <p>@my-app/shared 包导入示例：</p>
                        <p>safeNum('123') = {validNum}</p>
                        <p>safeNum('abc') = {invalidNum}</p>
                    </div>
                </div>
            );
        };
        return render;
    },
});

export default HomeView;
