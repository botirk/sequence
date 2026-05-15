// @ts-check
import { render, html, useState, useRef, useEffect } from '../assets/preact.mjs'

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

const TIMEOUT = 1500

/**
 * 
 * @param {{ initialPairs: ListPair[], list: List }} param0 
 */
const Game = ({ initialPairs, list }) => {
    /** @type {[ListPair[], any]} */
    const [pairs, setPairs] = useState(initialPairs)
    const [showResponse, setShowResponse] = useState(undefined)
    const doneEl = useRef()

    const curPair = pairs.find(pair => !pair.complete)
    const done = pairs.filter(pair => pair.complete)

    useEffect(() => {
        setTimeout(() => { if (doneEl.current) doneEl.current.scrollTop += 10000 }, 100)
    }, [pairs])

    const onIncorrectSelected = () => {
        if (showResponse) return
        setShowResponse(curPair?.incorrect)
        setTimeout(() => {
            if (!curPair) return
            const i = pairs.indexOf(curPair)
            if (i < 0) return
            setShowResponse(undefined)
            const newPairs = [...pairs]
            newPairs[i] = { ...curPair, error: true }
            setPairs(newPairs)
        }, TIMEOUT)
    }

    const onCorrectSelected = () => {
        if (showResponse) return
        setShowResponse(curPair?.correct)
        setTimeout(() => {
            if (!curPair) return
            const i = pairs.indexOf(curPair)
            if (i < 0) return
            setShowResponse(undefined)
            const newPairs = [...pairs]
            newPairs[i] = { ...curPair, complete: true }
            setPairs(newPairs)
        }, TIMEOUT)
    }

    const incorrectRedBorder = (showResponse === curPair?.incorrect)
    const correctGreenBorder = (showResponse === curPair?.correct)

    const end = () => {
        switchStyles(false)
        renderMainMenu(list)
    }


    return html`
        <div class="cur">
            ${curPair && curPair.reverse && curPair.incorrect ? html`<${ListItemLib} listItem=${curPair.incorrect} onclick=${onIncorrectSelected} className="cursor-p"  redBorder=${incorrectRedBorder}  /><div class="or">${getTranslation('or')}</div>` : null}
            ${curPair && curPair.correct ? html`<${ListItemLib} listItem=${curPair.correct} onclick=${onCorrectSelected} className="cursor-p" greenBorder=${correctGreenBorder} />` : null}
            ${curPair && !curPair.reverse && curPair.incorrect ? html`<div class="or">${getTranslation('or')}</div><${ListItemLib} listItem=${curPair.incorrect} onclick=${onIncorrectSelected} className="cursor-p" redBorder=${incorrectRedBorder} />` : null}
            ${!curPair ? html`<div class="end icon grey-hover cursor-p" onclick=${end}/>` : null}
        </div>
        <div class="done" ref=${doneEl}>
            ${done.map(pair => html`<${ListItemLib} listItem=${pair.correct} redBorder=${pair.error} greenBorder=${!pair.error} />`)}
            <div class="dummy" />
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
    render(html`<${Game} initialPairs=${pairs} list=${list} />`, container)
}