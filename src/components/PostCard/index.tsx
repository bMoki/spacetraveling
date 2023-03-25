import styles from './postCard.module.scss'
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link'
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

interface PostCardProps {
    title: string,
    subtitle: string,
    time: string,
    author: string,
    slug: string,
}

export default function PostCard({ author, subtitle, time, title, slug }: PostCardProps) {
    return (
        <Link href={`/post/${slug}`}>
            <a>
                <div className={styles.container}>

                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                    <div>
                        <time>
                            <FiCalendar size={20} />
                            {format(
                                new Date(time),
                                "dd MMM yyyy",
                                {
                                    locale: ptBR
                                }
                            )}</time>
                        <span><FiUser size={20} />{author}</span>
                    </div>
                </div>
            </a>
        </Link>
    )
}