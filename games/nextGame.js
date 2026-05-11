// @ts-check
import { render, html, useState, useCallback } from '../assets/preact.mjs'

/** @import { List, ListItem } from "../global" */
import { ListItemLib } from '../lib.js'
import { renderMainMenu } from '../main.js'
import { getTranslation } from '../translate.js'

/**
 * @typedef {Object} ListPair
 * @prop {ListItem} correct
 * @prop {ListItem} incorrect
 */

/** @type {HTMLDivElement} */ // @ts-expect-error exists
const container = document.getElementById('container')

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
    render(null, container)
    switchStyles(true)
    
}