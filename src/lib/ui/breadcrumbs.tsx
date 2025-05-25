import style from './breadcrumbs.module.css'


export function Breadcrumbs({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <nav className={style.breadcrumbs}>{children}</nav>
    )
}
