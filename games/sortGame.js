// @ts-check
import { render, html, useState, useCallback } from '../assets/preact.mjs'

/** @import { List, ListItem } from "../global" */
import { shuffleArray, isListCorrect, ListItemLib } from '../lib.js'
import { renderMainMenu } from '../main.js'
import { getTranslation } from '../translate.js'



/** @type {HTMLDivElement} */ // @ts-expect-error exists
const container = document.getElementById('container')

/**
 * 
 * @param {{ listItem: ListItem, showAnswer: boolean, easy: boolean, isCorrect: boolean, onMove: (li: ListItem, change: number) => void, last: boolean, first: boolean }} param0
 */
const ListItem = ({ listItem, showAnswer, easy, isCorrect, onMove, first, last }) => { 
    return html`
        <${ListItemLib} listItem=${listItem} greenBorder=${(easy || showAnswer) && isCorrect} redBorder=${showAnswer && !isCorrect} />
        <div class="arrows">
            <button class="up icon grey-hover" onclick=${() => onMove(listItem, -1)} disabled=${first || showAnswer} title=${getTranslation('moveUp')} aria-label=${getTranslation('moveUp')} />
            <button class="down icon grey-hover" onclick=${() => onMove(listItem, +1)} disabled=${last || showAnswer} title=${getTranslation('moveDown')} aria-label=${getTranslation('moveDown')} />
        </div>
    `
}

/**
 * 
 * @param {{ answer: List, initialList: List, easy: boolean }} param0 
 */
const Game = ({ answer, initialList, easy }) => {
    const [list, setList] = useState(initialList)
    const [changed, setChanged] = useState(initialList.length <= 1)
    const [showAnswer, setShowAnswer] = useState(false)

    const onMove = useCallback(/** @param {ListItem} li; @param {number} change */ (li, change) => {
        const i = list.indexOf(li)
        if (i < 0) return
        if (change < 0 && i > 0) {
            const newList = [...list]
            newList.splice(i, 1)
            newList.splice(i - 1, 0, li)
            setList(newList)
            setChanged(true)
        } else if (change > 0 && i < list.length - 1) {
            const newList = [...list]
            newList.splice(i, 1)
            newList.splice(i + 1, 0, li)
            setList(newList)
            setChanged(true)
        }
    }, [list])

    const finish = () => {
        switchStyles(false)
        renderMainMenu(answer)
    }

    return html`
        <div class="sort-game">
            ${list.map(/** @param {ListItem} li; @param {number} i */ (li, i) =>
                html`<${ListItem} 
                        key=${li.id} listItem=${li} showAnswer=${showAnswer} 
                        easy=${easy} isCorrect=${isListCorrect(answer, list, i)}
                        first=${i === 0} last=${i >= list.length - 1}
                        onMove=${onMove}
                    />`
            )}
            ${(changed && !showAnswer) ? html`<button onclick=${() => setShowAnswer(true)} class="check grey-hover icon" title=${getTranslation('check')} aria-label=${getTranslation('check')} />` : null}
            ${(showAnswer) ? html`<button onclick=${finish} class="back grey-hover icon" title=${getTranslation('toMainMenu')} aria-label=${getTranslation('toMainMenu')} />` : null}
        </div>
    `
}

const switchStyles = (state = true) => {
    const link = document.head.querySelector('link[href="./games/sortGame.css"]')
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
 * @param {boolean} easy
 */
export const renderGame = (list, easy) => {
    let shuffled = shuffleArray([...list])
    while (shuffled.length > 1 && isListCorrect(list, shuffled)) shuffled = shuffleArray([...list])

    render(null, container)
    switchStyles(true)
    render(html`<${Game} answer=${list} initialList=${shuffled} easy=${easy} />`, container)
}