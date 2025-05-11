/** Fisher–Yates shuffle
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
