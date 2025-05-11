import Layout from '@/lib/ui/layout'


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (<Layout showFooter={false}>{children}</Layout>)
}
