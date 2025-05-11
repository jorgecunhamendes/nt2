'use client'

import Link from 'next/link'
import { useEffect, useReducer } from 'react'

import { shuffle } from '../array'

import style from './cards.module.css'


export interface Card {
    id: string | number,
    front: string,
    back: string,
}


export interface CardsParams {
    cards: Card[],
    length: number,
}


export function Cards({ cards, length }: Readonly<CardsParams>) {
    const [state, dispatch] = useReducer(stateReducer, {
        cards: [],
        index: 0,
        side: 'front',
        incorrect: 0,
    })
    const action = (type: Exclude<CardAction['type'], 'set'>) => () => dispatch({ type })
    const CardButtons = () => (
        <div className={style.buttons}>
            <button disabled={state.side === 'front'} onClick={action('incorrect')}>Incorrect</button>
            <button disabled={state.side === 'back'} onClick={action('check')}>Check</button>
            <button disabled={state.side === 'front'} onClick={action('correct')}>Correct</button>
        </div>
    )
    const Result = () => {
        const total = state.cards.length
        const correct = total - state.incorrect
        const percentage = correct / total * 100
        return (
            <>
                <div className={style.result}>
                    Correct: {correct}/{total} ({percentage.toFixed(0)}%)
                </div>
                <div className={style.buttons}>
                    <Link href="/" prefetch={false}>Close</Link>
                    <button onClick={() => dispatch({ type: 'set', cards: shuffle(cards).slice(0, length) })}>Retry</button>
                </div>
            </>
        )
    }
    const DisplayCard = () => (
        <>
            <Card card={state.cards[state.index]} side={state.side} />
            <div className={style.progress}>{state.index + 1} / {state.cards.length}</div>
            <CardButtons />
        </>
    )
    const content = state.cards.length === 0
        ? null
        : state.index < state.cards.length
            ? <DisplayCard />
            : <Result />
    useEffect(() => {
        dispatch({ type: 'set', cards: shuffle(cards).slice(0, length) })
    }, [cards, length])
    return (
        <div className={style.cards}>
            {content}
        </div>
    )
}


type Side = 'front' | 'back'


interface CardState {
    cards: Card[],
    index: number,
    side: Side,
    incorrect: number,
}


type CardAction = {
    type: 'set',
    cards: Card[],
} | {
    type: 'check' | 'incorrect' | 'correct'
}


function stateReducer(prevState: CardState, action: CardAction): CardState {
    const next = (): CardState => {
        if (prevState.side === 'front') {
            return { ...prevState, side: 'back' }
        } else {
            return { ...prevState, index: prevState.index + 1, side: 'front' }
        }
    }
    switch (action.type) {
        case 'set':
            return {
                cards: action.cards,
                index: 0,
                side: 'front',
                incorrect: 0,
            }
        case 'check':
            return next()
        case 'incorrect':
            return { ...next(), incorrect: prevState.incorrect + 1 }
        case 'correct':
            return next()
    }
}


interface CardParams {
    card: Card,
    side: Side,
}


function Card({ card, side }: Readonly<CardParams>) {
    return (
        <div className={style.card}>
            <p>{card.front}</p>
            <hr />
            <p>{side === 'front' ? null : card.back}</p>
        </div>
    )
}
