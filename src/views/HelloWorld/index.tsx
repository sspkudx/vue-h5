import { type FunctionalComponent as FC } from 'vue';
import styles from './style.module.css';

const HelloWorld: FC = () => {
    return <h1 class={styles.title}>hello</h1>;
};

export default HelloWorld;
