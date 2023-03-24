import styles from './post.module.scss'
import { FiCalendar, FiUser } from 'react-icons/fi';

export function Post() {
    return (
        <div className={styles.container}>
            <h2>Como Utilizar Hooks</h2>
            <p>Pensando em sincronização em vez de ciclos de vida</p>
            <div>
                <time><FiCalendar size={20} />15 Mar 2021</time>
                <span><FiUser size={20} />Joseph Oliveira</span>
            </div>
        </div>
    )
}