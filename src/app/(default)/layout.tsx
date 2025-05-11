import type { Metadata } from 'next'

import Layout from '@/lib/ui/layout'


export const metadata: Metadata = {
    title: 'Nederlands tweede taal (nt2)',
}


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (<Layout>{children}</Layout>)
}
