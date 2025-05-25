'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type MouseEventHandler } from 'react'

import { About, Menu, Quiz, ViewList, Xmark } from '@/lib/ui/icon'

import style from './template.module.css'


const layoutThreshold = 660


export default function App({ children }: { children: React.ReactNode }) {
    const path = usePathname()
    const [sidebarHidden, setSidebarHidden] = useState(true)
    const onMenuToggle = () => {
        setSidebarHidden(!sidebarHidden)
    }
    useEffect(() => {
        function onResize() {
            if (window.innerWidth > layoutThreshold) {
                setSidebarHidden(true)
            }
        }
        window.addEventListener('resize', onResize)
        window.addEventListener('', onResize)
        onResize()
        return () => window.removeEventListener('resize', onResize)
    }, [])
    useEffect(() => {
        setSidebarHidden(true)
    }, [path])
    const [oddRender, setOddRender] = useState(true)
    const reRender: MouseEventHandler<HTMLAnchorElement> = (e) => {
        if (e.currentTarget.pathname === path) {
            setSidebarHidden(true)
            setOddRender(!oddRender)
        }
    }
    function SidebarLink({ href, children }: Readonly<SidebarLinkParams>) {
        return (
            <Link href={href} onClick={reRender}>{children}</Link>
        )
    }
    return (
        <>
            <header className={style.topbar}>
                {sidebarHidden
                    ? <Menu className={style.menuIcon} onClick={onMenuToggle} />
                    : <Xmark className={style.menuIcon} onClick={onMenuToggle} />
                }
                <Link href="/">NT2</Link>
            </header>
            <div className={style.layoutMiddle}>
                <Sidebar hidden={sidebarHidden}>
                    <SidebarGroup>
                        <SidebarGroup>
                            <h2>Het Perfectum</h2>
                            <SidebarLink href="/perfectum"><ViewList className={style.icon} />Werkwoorden</SidebarLink>
                            <SidebarLink href="/perfectum/kaarten"><Quiz className={style.icon} />Flitskaarten</SidebarLink>
                        </SidebarGroup>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarLink href="/over"><About className={style.icon} />Over</SidebarLink>
                    </SidebarGroup>
                </Sidebar>
                <div className={classnames(style.content, optional(!sidebarHidden, style.blurred))}>
                    {oddRender ? children : null}
                    {oddRender ? null : children}
                </div>
            </div>
            <footer className="layoutBottom">Copyright © 2025 Jorge Cunha Mendes</footer>
        </>
    )
}


interface SidebarParams {
    hidden: boolean,
    children?: React.ReactNode,
}


function Sidebar({ hidden, children }: Readonly<SidebarParams>) {
    return (
        <nav className={classnames(style.sidebar, optional(hidden, style.hidden))}>
            {children}
        </nav>
    )
}


interface SidebarGroupParams {
    children?: React.ReactNode,
}


function SidebarGroup({ children }: Readonly<SidebarGroupParams>) {
    return (
        <div className={style.sidebarGroup}>
            {children}
        </div>
    )
}


interface SidebarLinkParams {
    href: string,
    children?: React.ReactNode,
}


function optional<T>(pred: boolean, value: T): T | undefined {
    return pred ? value : undefined
}


function classnames(...names: Array<string | undefined>) {
    return names.filter(n => typeof n !== 'undefined').join(' ')
}
