import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <>
      <header className={styles.header}>
        <Link href="/">
          <a>
            <Image src="/logo.svg" alt="logo" width="238.62" height="100" />
          </a>
        </Link>
      </header>
    </>
  );
}
