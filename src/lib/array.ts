/**
 * Fisher–Yates shuffle
 *
 * Adapted from: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#JavaScript_implementation
 *
 * @param array Array containing values to shuffle.
 * @returns A shuffled copy of `array`.
 *
 * @license https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License#License
 */
export function shuffle<T>(array: T[]): T[] {
    const result = array.slice()
    for (let i = result.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]
    }
    return result
}


export interface WeightedElement<T> {
    elem: T,
    weight: number,
}


/**
 * Removes randomly an element from an array of weighted elements and returns it
 * modifying the original array.
 *
 * @param elems Weighted elements.
 * @param totalWeight Sum of the weighted elements or undefined.
 * @returns A random element based on the weights of the elements in the array.
 */
export function randomWeightedSplice<T>(
    elems: WeightedElement<T>[],
    totalWeight?: number
): WeightedElement<T> {
    totalWeight ??= weightSum(elems)
    const val = Math.floor(Math.random() * (totalWeight + 1))
    let acc = 0
    let j = 0
    while (acc < val && j < elems.length) {
        acc += elems[j].weight
        j += 1
    }
    return elems.splice(Math.min(j, elems.length - 1), 1)[0]
}


export function weightSum<T>(elems: WeightedElement<T>[]) : number {
    return elems.reduce((t, p) => t + p.weight, 0)
}
