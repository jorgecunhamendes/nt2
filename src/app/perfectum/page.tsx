'use client'

import { useEffect, useState } from 'react'

import { loadFromStorate } from '@/lib/storage'
import { Breadcrumbs } from '@/lib/ui/breadcrumbs'

import { Check, Stat0, StatM1, StatM2, StatM3, StatP1, StatP2, StatP3 } from '@/lib/ui/icon'

import style from './page.module.css'

import perfectum from '@/data/verbs.json'


export default function Page() {
    const [stats, setStats] = useState<Record<string, number>>({})
    useEffect(() => {
        const perfectum = loadFromStorate('perfectum') as Record<string, string>
        const storedStats: Record<string, number> = {}
        Object.keys(perfectum).forEach(k => {
            const positive = (perfectum[k] ?? '').match(/1/g)?.length ?? 0
            const negative = perfectum[k].length - positive
            storedStats[k] = positive - negative
        })
        setStats(storedStats)
    }, [])
    return (
        <main>
            <Breadcrumbs>
                <span>Het Perfectum</span>
                <span>Werkwoorden</span>
            </Breadcrumbs>
            <div className={style.page}>
                <p style={{ fontSize: '90%' }}>R: regelmatig</p>
                <p style={{ fontSize: '90%' }}>S: score (van -6 t.e.m. 6)</p>
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th scope='col'>Infinitief</th>
                            <th scope="col" title="Regelmatig" style={{ textAlign: 'center' }}>R</th>
                            <th scope="col" colSpan={2}>Perfectum</th>
                            <th scope="col" title="Score" style={{ textAlign: 'center' }}>S</th>
                        </tr>
                    </thead>
                    <tbody>
                        {perfectum.map(v => <tr key={v.infinitive}>
                            <Row
                                infinitive={v.infinitive}
                                v1={v.perfect.verb[0]}
                                v2={v.perfect.verb[1]}
                                regular={v.perfect.regular}
                                stat={stats[v.infinitive]}
                            />
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </main>
    )
}


interface RowParams {
    infinitive: string,
    v1: string,
    v2: string,
    regular: boolean,
    stat?: number,
}


function Row({ infinitive, v1, v2, regular, stat }: Readonly<RowParams>) {
    let statIcon = null
    if (typeof stat !== 'undefined') {
        switch (Math.trunc(stat / 2)) {
            case -3:
                statIcon = <StatM3 fill={'#C21111'} />
                break
            case -2:
                statIcon = <StatM2 fill={'#950909'} />
                break
            case -1:
                statIcon = <StatM1 fill={'#6D1E1E'} />
                break
            case 0:
                statIcon = <Stat0 />
                break
            case 1:
                statIcon = <StatP1 fill={'#1E6D1E'} />
                break
            case 2:
                statIcon = <StatP2 fill={'#099509'} />
                break
            case 3:
                statIcon = <StatP3 fill={'#11C211'} />
                break
            default:
                console.warn('unsupported stat', stat)
        }
    }
    return (
        <>
            <td>{infinitive}</td>
            <td className={style.colRegular} style={{ textAlign: 'center' }}>{regular ? <Check /> : null}</td>
            <td>{v1}</td>
            <td>{v2}</td>
            <td title={stat?.toString()} style={{ textAlign: 'center' }}>{statIcon}</td>
        </>
    )
}
