import { Open_Sans } from 'next/font/google'


const font = Open_Sans({
    subsets: ['latin'],
})


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode,
}>) {
    return (
        <html lang="en">
            <body className={`${font.style}`}>{children}</body>
        </html>
    )
}
