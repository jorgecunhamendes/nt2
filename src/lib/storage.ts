'use client'

export function loadFromStorate(storageKey: string): unknown {
    return JSON.parse(localStorage.getItem(storageKey) ?? '{}')
}


export function saveToStorage(storageKey: string, value: unknown) {
    localStorage.setItem(storageKey, JSON.stringify(value))
}
