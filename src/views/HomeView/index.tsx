import { type FunctionalComponent as FC } from 'vue';
import styles from './style.module.less';

const HomeView: FC = () => {
    return <div class={styles['home-view']}>Hello World</div>;
};

export default HomeView;
