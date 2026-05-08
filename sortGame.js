// @ts-check
import { render, html, useState, useCallback, useEffect } from './assets/preact.mjs'

import { shuffleArray, isListCorrect, ListItemLib } from './lib.js'
import { renderMainMenu } from './main.js'


/** @type {HTMLDivElement} */ // @ts-expect-error exists
const container = document.getElementById('container')

/**
 * 
 * @param {{ listItem: ListItem, showAnswer: boolean, easy: boolean, isCorrect: boolean }} param0
 */
const ListItem = ({ listItem, showAnswer, easy, isCorrect }) => {
    return html`
        <${ListItemLib} listItem=${listItem} />
        <div class="arrows">
            <div class="up icon" />
            <div class="down icon" />
        </div>
    `
}

/**
 * 
 * @param {{ answer: List, initialList: List, easy: boolean }} param0 
 */
const Game = ({ answer, initialList, easy }) => {
    const [list, setList] = useState(initialList)
    const showAnswer = useState(false)

    return html`
        <div class="sort-game"> 
            ${list.map(/** @param {ListItem} li; @param {number} i */ (li, i) =>
                html`<${ListItem} key=${li.id} listItem=${li} showAnswer=${showAnswer} easy=${easy} isCorrect=${isListCorrect(answer, list, i)} />`
            )}
        </div>
    `
}

const switchStyles = (state = true) => {
    const link = document.head.querySelector('link[href="sortGame.css"]')
    if (state && !link) {
        const link = document.createElement('link')
        link.href = 'sortGame.css'
        link.rel = 'stylesheet'
        document.head.appendChild(link)
    } else if (!state && link) {
        link.remove()
    }
}

/**
 * @param {List} list
 * @param {boolean} easy
 */
export const renderGame = (list, easy) => {
    let shuffled = shuffleArray([...list])
    while (shuffled.length > 1 && isListCorrect(list, shuffled)) shuffled = shuffleArray([...list])

    render(null, container)
    switchStyles(true)
    render(html`<${Game} answer=${list} initialList=${shuffled} easy=${easy} />`, container)
}