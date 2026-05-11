// @ts-check
import { render, html, useState, useCallback } from '../assets/preact.mjs'

/** @import { List, ListItem } from "../global" */
import { ListItemLib } from '../lib.js'
import { renderMainMenu } from '../main.js'
import { getTranslation } from '../translate.js'

/**
 * @typedef {Object} ListPair
 * @prop {ListItem} correct
 * @prop {ListItem|void} incorrect
 * @prop {boolean} complete
 * @prop {boolean} reverse
 * @prop {boolean} error
 */

/** @type {HTMLDivElement} */ // @ts-expect-error exists
const container = document.getElementById('container')

/**
 * 
 * @param {{ initialPairs: ListPair[] }} param0 
 */
const Game = ({ initialPairs }) => {
    /** @type {[ListPair[], any]} */
    const [pairs, setPairs] = useState(initialPairs)

    const curPair = pairs.find(pair => !pair.complete)
    const done = pairs.filter(pair => pair.complete)


    return html`
        <div class="cur">

        </div>
        <div class="done">
            ${done.map(pair => html`<${ListItemLib} listItem=${pair.correct} />`)}
        </div>
    `
}

const switchStyles = (state = true) => {
    const link = document.head.querySelector('link[href="./games/nextGame.css"]')
    if (link) {
        if (state) {
            link.removeAttribute('disabled')
        } else if (!state && link) {
            link.setAttribute('disabled', 'true')
        }
    }
}

/**
 * @param {List} list
 */
export const renderGame = (list) => {
    const pairs = list.map(li => {
        /** @type {ListPair} */
        const pair = { correct: li, incorrect: undefined, complete: false, error: false, reverse: (Math.random() < 0.5) }
        const candidates = list.filter(item => item !== li)
        if (candidates.length) {
            pair.incorrect = candidates[Math.floor(Math.random() * candidates.length)]
        }
        return pair
    })

    render(null, container)
    switchStyles(true)
    render(html`<${Game} initialPairs=${pairs} />`, container)
}