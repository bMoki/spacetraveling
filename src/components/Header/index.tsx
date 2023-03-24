import styles from './header.module.scss'
import Image from 'next/image'
import MyLogo from '../../public/images/Logo.png'
import Link from 'next/link'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href={'/'}>
        <a>
          <Image
            src={MyLogo}
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


{/* <span>{"</>"}</span>
      <h2>spacetraveling</h2>
      <span>.</span> */}