import Link from 'next/link'

import './layout.css'


export default function Layout({
    children,
    showFooter,
}: Readonly<{
    children: React.ReactNode,
    showFooter?: boolean,
}>) {
    return (
        <>
            <header>
                <nav>
                    <Link href="/">NT2</Link>
                    <Link href="/about">About</Link>
                </nav>
            </header>
            {children}
            {showFooter === false ? null : <footer>Copyright © 2025 Jorge Cunha Mendes</footer>}
        </>
    )
}
