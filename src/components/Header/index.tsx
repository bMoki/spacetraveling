import styles from './header.module.scss'
import Image from 'next/image'
import Logo from '../../public/images/Logo.png'
import Link from 'next/link'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href={'/'}>
        <a>
          <Image
            src='/Logo.svg'
            alt='logo'
            width={238.62}
            height={25.63}
            className={styles.image}
          />
        </a>
      </Link>

    </header>
  )
}