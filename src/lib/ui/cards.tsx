'use client'

import { useReducer, useState, type JSX } from 'react'

import { randomWeightedSplice, weightSum, type WeightedElement } from '@/lib/array'
import { loadFromStorate, saveToStorage } from '@/lib/storage'

import { Check, Eye, Xmark } from '@/lib/ui/icon'

import style from './cards.module.css'


const DEFAULT_SESSION_LENGTH: number = 10
const CARD_HISTORY: number = 6


export interface Card<A, B> {
    id: string | number,
    sideA: A,
    sideB: B,
}


export interface OldCard {
    id: string | number,
    infinitive: string,
    perfect: {
        verb: string[],
        regular: boolean,
    },
}


export interface CardsSessionParams<A, B> {
    HowTo: (props: { className?: string }) => React.ReactNode,
    SideA: (props: { className?: string, card: Card<A, B> }) => React.ReactNode,
    SideB: (props: { className?: string, card: Card<A, B> }) => React.ReactNode,
    storageKey: string,
    filters: CardsSessionFilter<A, B>[],
    cards: Card<A, B>[],
    length: number,
}


export interface CardsSessionFilter<A, B> {
    name: string,
    filter: (cards: Card<A, B>[]) => Card<A, B>[],
}


export function CardsSession<A, B>({
    HowTo,
    SideA,
    SideB,
    storageKey,
    filters,
    cards,
    length,
}: CardsSessionParams<A, B>): JSX.Element {
    const [state, dispatch] = useReducer(sessionStateReducer, {
        page: 'options',
        length: DEFAULT_SESSION_LENGTH,
        selectedCards: cards,
        filteredCards: [],
        cardIndex: 0,
        side: 'A',
        incorrect: 0,
    })
    switch (state.page) {
        case 'options':
            return (
                <div className={style.start}>
                    <HowTo className={style.howto} />
                    <SessionSettings
                        filters={filters}
                        length={length}
                        onChange={(filter, length) => dispatch(
                            { type: 'setSettings', cardSelection: filter.filter(cards), length }
                        )}
                    />
                    <button
                        className={style.startButton}
                        onClick={() => dispatch([
                            { type: 'shuffle', weights: weighCards(storageKey, state.selectedCards) },
                            { type: 'goto', page: 'cards' }
                        ])}
                    >Start</button>
                </div>
            )
        case 'cards':
            return (
                <Cards
                    cards={state.filteredCards}
                    index={state.cardIndex}
                    side={state.side}
                    SideA={SideA}
                    SideB={SideB}
                    onFlipClick={() => { dispatch({ type: 'flip' }) }}
                    onCorrectClick={verb => {
                        saveCardResult(storageKey, verb, true)
                        dispatch({ type: 'nextCard' })
                    }}
                    onIncorrectClick={verb => {
                        saveCardResult(storageKey, verb, false)
                        dispatch({ type: 'nextCard' })
                    }}
                />
            )
        case 'result':
            return <Result
                total={state.filteredCards.length}
                correct={state.filteredCards.length - state.incorrect}
                onOptionsClick={() => dispatch(
                    { type: 'goto', page: 'options' })
                }
                onRestartClick={() => dispatch([
                    { type: 'shuffle', weights: weighCards(storageKey, state.selectedCards) },
                    { type: 'goto', page: 'cards' },
                ])}
            />
    }
}


interface SessionState<A, B> {
    page: 'options' | 'cards' | 'result',
    selectedCards: Card<A, B>[],
    length: number,
    filteredCards: Card<A, B>[],
    cardIndex: number,
    side: 'A' | 'B',
    incorrect: number,
}


type SessionAction<A, B> = {
    type: 'goto'
    page: SessionState<A, B>['page'],
} | {
    type: 'setSettings',
    cardSelection: Card<A, B>[],
    length: number,
} | {
    type: 'shuffle',
    weights: { elem: Card<A, B>; weight: number }[],
} | {
    type: 'flip',
} | {
    type: 'nextCard',
}


function sessionStateReducer<A, B>(
    prevState: SessionState<A, B>,
    actions: SessionAction<A, B> | SessionAction<A, B>[]
): SessionState<A, B> {
    actions = Array.isArray(actions) ? actions : [actions]
    return actions.reduce((state, action) => {
        switch (action.type) {
            case 'goto': {
                return { ...state, page: action.page }
            }
            case 'setSettings': {
                return {
                    ...state,
                    selectedCards: action.cardSelection,
                    length: action.length,
                }
            }
            case 'shuffle': {
                const weights = [...action.weights]
                const filteredCards = []
                let totalWeight = weightSum(weights)
                for (let i = 0; i < state.length; i++) {
                    const e = randomWeightedSplice(weights, totalWeight)
                    if (weights.length === 0) {
                        weights.push(...action.weights)
                        totalWeight = weightSum(weights)
                    } else {
                        totalWeight -= e.weight
                    }
                    filteredCards.push(e.elem)
                }
                return {
                    ...state,
                    filteredCards,
                    incorrect: 0,
                }
            }
            case 'flip': {
                return {
                    ...state,
                    side: 'B',
                }
            }
            case 'nextCard': {
                const done = state.cardIndex + 1 >= state.filteredCards.length
                return {
                    ...state,
                    cardIndex: done ? 0 : state.cardIndex + 1,
                    side: 'A',
                    page: done ? 'result' : state.page,
                }
            }
        }
    }, prevState)
}


function weighCards<A, B>(
    storageKey: string,
    cards: Card<A, B>[]
): WeightedElement<Card<A, B>>[] {
    const saved = loadFromStorate(storageKey) as Record<string, string>
    return cards.map(c => {
        const correct = (saved[c.id] ?? '').match(/1/g)?.length ?? 0
        return { elem: c, weight: CARD_HISTORY + 1 - correct }
    })
}


function saveCardResult(storageKey: string, id: string | number, correct: boolean) {
    const old = loadFromStorate(storageKey) as Record<string, string>
    const history = `${correct ? '1' : '0'}${old[id] ?? ''}`.slice(0, CARD_HISTORY)
    saveToStorage(storageKey, { ...old, [id]: history })
}


interface SessionSettingsParams<A, B> {
    filters: CardsSessionFilter<A, B>[],
    length: number,
    onChange: (filter: CardsSessionFilter<A, B>, length: number) => void,
}


function SessionSettings<A, B>({
    filters,
    length,
    onChange,
}: SessionSettingsParams<A, B>) {
    const [filterIndex, setFilterIndex] = useState(0)
    const [n, setN] = useState(length)
    const setFilter = (i: number) => () => {
        setFilterIndex(i)
        onChange(filters[i], n)
    }
    const setLength = (n: number) => () => {
        setN(n)
        onChange(filters[filterIndex], n)
    }
    type FilterButtonParams = { index: number, name: string, active: boolean }
    const FilterButton = ({ index, name, active }: FilterButtonParams) => {
        return (
            <div
                className={active ? style.sessionActiveFilter : undefined}
                onClick={setFilter(index)}
            ><span>{name}</span>{active ? <Check /> : null}</div>
        )
    }
    const NumberButtom = ({ value }: { value: number }) => {
        return (
            <span
                className={n === value ? style.selected : ''}
                onClick={setLength(value)}
            >
                {value}
            </span>
        )
    }
    return (
        <>
            <p>Kaartenset:</p>
            <div className={style.sessionFilters}>
                {filters.map((f, i) =>
                    <FilterButton
                        key={i}
                        index={i}
                        name={f.name}
                        active={i === filterIndex}
                    />
                )}
            </div>
            <label>
                <div>Aantal kaarten:</div>
                <div className={style.numberOfCards}>
                    <NumberButtom value={5} />
                    <NumberButtom value={10} />
                    <NumberButtom value={15} />
                    <NumberButtom value={20} />
                </div>
            </label>
        </>
    )
}


interface CardsParams<A, B> {
    cards: Card<A, B>[],
    index: number,
    side: 'A' | 'B',
    SideA: (props: { className?: string, card: Card<A, B> }) => React.ReactNode,
    SideB: (props: { className?: string, card: Card<A, B> }) => React.ReactNode,
    onFlipClick: () => void,
    onCorrectClick: (id: string | number) => void,
    onIncorrectClick: (id: string | number) => void,
}


function Cards<A, B>({
    cards,
    index,
    side,
    SideA,
    SideB,
    onFlipClick,
    onCorrectClick,
    onIncorrectClick,
}: Readonly<CardsParams<A, B>>) {
    return (
        <div className={style.cards}>
            <div className={style.card}>
                <SideA card={cards[index]} />
                <div key={index} className={side === 'A' ? style.cardB : `${style.cardB} ${style.show}`} onClick={onFlipClick}>
                    <div className={style.cardFront}>
                        <Eye size={96} fill="#ccc" />
                    </div>
                    <div className={style.cardBack}>
                        <SideB card={cards[index]} />
                    </div>
                </div>
            </div>
            <div className={style.progress}>{index + 1} / {cards.length}</div>
            <div className={style.buttons}>
                <button
                    className={style.incorrect}
                    disabled={side === 'A'}
                    onClick={() => onIncorrectClick(cards[index].id)}
                >
                    <Xmark fill={side === 'A' ? '#999' : '#ff6347'} /> Niet correct
                </button>
                <button
                    className={style.correct}
                    disabled={side === 'A'}
                    onClick={() => onCorrectClick(cards[index].id)}
                >
                    <Check fill={side === 'A' ? '#999' : '#90ee90'} /> Correct
                </button>
            </div >
        </div>
    )
}


function Result({
    total,
    correct,
    onOptionsClick,
    onRestartClick,
}: Readonly<{
    total: number,
    correct: number,
    onOptionsClick: () => void,
    onRestartClick: () => void,
}>) {
    const percentage = correct / total * 100
    return (
        <>
            <div className={style.result}>
                Correct: {correct}/{total} ({percentage.toFixed(0)}%)
            </div>
            <div className={style.buttons}>
                <button onClick={onOptionsClick}>Opties</button>
                <button onClick={onRestartClick}>Opnieuw starten</button>
            </div>
        </>
    )
}
