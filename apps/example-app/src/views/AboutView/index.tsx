import { defineComponent } from 'vue';
import styles from './style.module.less';

const AboutView = defineComponent({
    name: 'AboutView',
    setup() {
        const render = () => {
            return <div class={styles['about-view']}>hello world</div>;
        };
        return render;
    },
});

export default AboutView;
