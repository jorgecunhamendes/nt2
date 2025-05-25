import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'

import './layout.css'


const font = Open_Sans({
    subsets: ['latin'],
})


export const metadata: Metadata = {
    title: 'Nederlands tweede taal (nt2)',
}


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode,
}>) {
    return (
        <html lang="nl">
            <body style={font.style}>{children}</body>
        </html>
    )
}
