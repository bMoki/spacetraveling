import styles from './header.module.scss'
import Image from 'next/image'
import MyLogo from '../../public/images/Logo.png'

export default function Header() {
  return (
    <header className={styles.header}>

      <Image
        src={MyLogo}
        alt='logo'
        width={238.62}
        height={25.63}
      />

    </header>
  )
}


{/* <span>{"</>"}</span>
      <h2>spacetraveling</h2>
      <span>.</span> */}