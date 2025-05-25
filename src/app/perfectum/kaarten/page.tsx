'use client'

import Link from "next/link"

import { Breadcrumbs } from "@/lib/ui/breadcrumbs"
import { CardsSession, type Card, type CardsSessionFilter } from "@/lib/ui/cards"

import { Check, Eye, Think, Xmark } from "@/lib/ui/icon"

import style from './page.module.css'

import verbs from "@/data/verbs.json"


export default function Page() {
    const filters: CardsSessionFilter<string, { regular: boolean, verb: string[] }>[] = [
        { name: 'Alle', filter: cards => cards },
        { name: 'Regelmatig', filter: cards => cards.filter(c => c.sideB.regular) },
        { name: 'Onregelmatig', filter: cards => cards.filter(c => !c.sideB.regular) },
    ]
    return (
        <main>
            <Breadcrumbs>
                <Link href="/perfectum">Het Perfectum</Link>
                <span>Kaarten</span>
            </Breadcrumbs>
            <CardsSession
                storageKey="perfectum"
                HowTo={HowTo}
                SideA={CardSideA}
                SideB={CardSideB}
                filters={filters}
                cards={verbs.map(v => ({
                    id: v.infinitive,
                    sideA: v.infinitive,
                    sideB: v.perfect,
                }))}
                length={10}
            />
        </main>
    )
}


function HowTo({ className }: { className?: string }) {
    return (
        <div className={className}>
            <p>Instructies:</p>
            <ol>
                <li>Kies de opties en druk op Start</li>
                <li>Voor elke kaart:
                    <ol type="a">
                        <li><Think size={20} /> Denk aan het perfectum van het werkwoord</li>
                        <li><Eye size={20} /> Tik om het antwoord te bekijken</li>
                        <li><Check size={20} /> Druk op &quot;correct&quot; als je het goed had;
                            <Xmark size={20} /> anders op &quot;niet correct&quot;.</li>
                    </ol>
                </li>
                <li>Bekijk je score!</li>
            </ol>
        </div>
    )
}


type SideA = string


type SideB = { regular: boolean, verb: string[] }


function CardSideA({ card }: Readonly<{ card: Card<SideA, SideB> }>) {
    return (
        <div>
            <p>Wat is het perfectum tijd van:</p>
            <p className={style.infinitive}>{card.sideA}</p>
        </div>
    )
}


function CardSideB({ card }: Readonly<{ card: Card<SideA, SideB> }>) {
    return (
        <div className={style.back}>
            <p className={style.perfect}>{`(${card.sideB.verb[0]}) ${card.sideB.verb[1]}`}</p>
            <p className={style.regular}>{card.sideB.regular ? 'regelmatig' : 'onregelmatig'}</p>
        </div>
    )
}
