// @ts-check
import { html, useEffect, useState } from "./assets/preact.mjs";

/** @import { List, ListItem } from "./global" */

/**
 * @template T
 * @param {T[]} array 
 * @returns {T[]}
 */
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * 
 * @param {List} list1
 * @param {List} list2
 * @param {number|void} i
 * @returns {boolean}
 */
export const isListCorrect = (list1, list2, i = undefined) => {
  if (i !== undefined) return list1[i]?.id === list2[i]?.id
  else return list1.length === list2.length && list1.every((_, i) => isListCorrect(list1, list2, i))
}

/**
 * 
 * @param {{ listItem: ListItem, greenBorder: boolean, redBorder: boolean }} param0 
 * @returns 
 */
export const ListItemLib = ({ listItem, greenBorder, redBorder }) => {
  const imgSrc = listItem.imgFile ? URL.createObjectURL(listItem.imgFile) : undefined
  useEffect(() => () => { if (imgSrc) URL.revokeObjectURL(imgSrc) })

  const textContainerClass = (imgSrc ? 'text-container' : 'text-container text-only')
  const imgClass = (greenBorder ? 'green-border' : redBorder ? 'red-border' : '')
  const textClass = (greenBorder ? 'text green-border' : redBorder ? 'text red-border' : 'text')

  return html`
    <div class="list-item-lib">
      ${imgSrc ? html`<img src=${imgSrc} alt=${listItem.description} class=${imgClass} />` : null}
      <div class=${textContainerClass}>
        ${listItem.description ? html`<div class=${textClass} style=${{ color: listItem.descriptionColor, '--color': listItem.descriptionColor, alignSelf: listItem.descriptionPosition }}>${listItem.description}</div>` : null}
      </div>
    </div>
  `
}