import { defineComponent } from 'vue';
import styles from './style.module.less';

const HomeView = defineComponent({
    setup() {
        const render = () => {
            return (
                <div class={styles.homeView}>
                    <p class={styles.homeView__text}>Yeah</p>
                    <p class={[styles.homeView__text, styles.homeView__text_gray]}>hello world</p>
                </div>
            );
        };
        return render;
    },
});

export default HomeView;
