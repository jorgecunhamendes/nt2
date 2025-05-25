'use client'

import Link from 'next/link'

import style from './page.module.css'


export default function Page() {
    const raiseAnIssue = <Link href="https://github.com/jorgecunhamendes/nt2/issues">Meld een probleem</Link>
    const projectPage = <Link href="https://github.com/jorgecunhamendes/nt2">Github-projectpagina</Link>
    const clearData = () => localStorage.clear()
    return (
        <main className={style.page}>
            <h2>Nederlands tweede taal (nt2)</h2>
            <div>
                <p>Oefeningen om Nederlands te leren.</p>
                <p>
                    Werkt er iets niet goed of is de inhoud onjuist?
                    {' '}{raiseAnIssue} of dien een correctie in via een pull-request
                    op de {projectPage}.
                </p>
            </div>
            <div>
                <h3>Technische informatie</h3>
                <ul>
                    <li>
                        Broncode: <Link href="https://github.com/jorgecunhamendes/nt2">Github</Link>
                    </li>
                    <li>
                        Pictogrammen:{' '}
                        <Link href="https://m3.material.io/styles/icons/overview">Material Symbols</Link>{' '}
                        (Licentie:{' '}
                        <Link href="http://www.apache.org/licenses/LICENSE-2.0.txt">
                            Apache License Version 2.0
                        </Link>
                        )
                    </li>
                </ul>
                <div>
                    <button onClick={clearData}>App-gegevens verwijderen</button>
                </div>
            </div>
        </main>
    )
}
