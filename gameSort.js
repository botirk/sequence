// @ts-check
import { shuffleArray, renderMainMenu } from "./main.js"

/** @type {HTMLDivElement} */ // @ts-expect-error
export const container = document.getElementById('container')

/**
 * 
 * @param {ListItem} listItem 
 */
const createCard = (listItem) => {
    const card = document.createElement('div')

    return card
}

/**
 * @param {List} list
 */
export const renderGame = (list) => {
    container.textContent = ''
    container.classList.add('game', 'sort-game')

    const shuffled = shuffleArray([...list])

    for (const li of shuffled) {
        container.appendChild(createCard(li))
    }
} 