import Link from 'next/link'


export default function Page() {
    return (
        <main className="center">
            <h2>Nederlands tweede taal (nt2)</h2>
            <div>
                <p>Study aid for learning Dutch.</p>
                <p>
                    Something malfunctioning or incorrect
                    contents? <Link href="https://github.com/jorgecunhamendes/nt2/issues">Raise
                    an issue</Link> or submit a correction via a pull request on
                    the <Link href="https://github.com/jorgecunhamendes/nt2">Github
                    project page</Link>.
                </p>
            </div>
        </main>
    )
}
