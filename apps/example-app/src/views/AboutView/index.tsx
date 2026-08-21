import { defineComponent } from 'vue';
import styles from './style.module.less';

/**
 * 关于页面
 * @description 极简示例页，演示 TSX 页面组件的基础写法（defineComponent + setup 返回渲染函数）
 */
const AboutView = defineComponent({
    name: 'AboutView',
    setup() {
        const render = () => {
            return <div class={styles['about-view']}>这是关于页面（示例）</div>;
        };
        return render;
    },
});

export default AboutView;
