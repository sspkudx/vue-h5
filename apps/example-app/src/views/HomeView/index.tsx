import { defineComponent } from 'vue';
import { safeNum } from '@my-app/shared';
import styles from './style.module.less';

const HomeView = defineComponent({
    name: 'HomeView',
    setup() {
        const render = () => {
            // 测试导入的shared包
            const testString = '123';
            const testInvalid = 'abc';
            const num1 = safeNum(testString);
            const num2 = safeNum(testInvalid);

            return (
                <div class={styles.homeView}>
                    <p class={styles.homeView__text}>Yeah</p>
                    <p class={[styles.homeView__text, styles.homeView__text_gray]}>hello world</p>
                    <div>
                        <p>测试@shared包导入:</p>
                        <p>safeNum('123') = {num1}</p>
                        <p>safeNum('abc') = {num2}</p>
                    </div>
                </div>
            );
        };
        return render;
    },
});

export default HomeView;
