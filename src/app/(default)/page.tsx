import Link from 'next/link'

import styles from './page.module.css'


export default function Page() {
    return (
        <main className={styles.page}>
            <Link href="/perfectum">Perfectum</Link>
        </main>
    )
}
