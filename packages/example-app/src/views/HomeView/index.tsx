import { defineComponent } from 'vue';
import styles from './style.module.less';

const HomeView = defineComponent({
    setup() {
        const render = () => {
            return <div class={styles['home-view']}>hello world</div>;
        };
        return render;
    },
});

export default HomeView;
