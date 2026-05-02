// @ts-check
import { getTranslation } from "./translate.js"

/**
 * @typedef {Object} ListItem
 * @prop {number} id
 * @prop {string|void} imgUrl
 * @prop {HTMLImageElement|void} imgEl
 * @prop {string} description
 * @prop {'start'|'center'|'end'|string} descriptionPosition
 */

/**
 * @typedef {ListItem[]} List
 */

/**
 * @param {List} list
 * @returns {ListItem}
 */
const createFreshListItem = (list) => {
    const nextId = Math.max(...list.map(li => li.id), 0) + 1

    const result = { 
        description: '',
        descriptionPosition: 'end',
        id: nextId,
        imgUrl: undefined,
        imgEl: undefined,
    }

    list.unshift(result)
    return result
}

/** @type {HTMLDivElement} */ // @ts-expect-error
export const container = document.getElementById('container')

/**
 * 
 * @param {List} list 
 * @returns {HTMLDivElement}
 */
const createTopMenu = (list) => {
    const topButtons = document.createElement('div')
    topButtons.className = 'top-buttons'

    const firstPart = document.createElement('div')
    firstPart.className = 'first'
    topButtons.appendChild(firstPart)

    const labelSelectFolderButton = document.createElement('label')
    labelSelectFolderButton.className = 'cursor-p'
    labelSelectFolderButton.htmlFor = 'select-folder'
    labelSelectFolderButton.title = getTranslation('selectFolder')
    firstPart.appendChild(labelSelectFolderButton)

    const selectFolderButton = document.createElement('input')
    selectFolderButton.id = 'select-folder'
    selectFolderButton.type = 'file'
    selectFolderButton.setAttribute('webkitdirectory', 'true')
    selectFolderButton.setAttribute('directory', 'true')
    selectFolderButton.onchange = (e) => {
        if (!selectFolderButton.files) return
    }
    firstPart.appendChild(selectFolderButton)

    const saveButton = document.createElement('div')
    saveButton.className = 'save cursor-p'
    saveButton.title = getTranslation('saveFolder')
    firstPart.appendChild(saveButton)

    const secondPart = document.createElement('div')
    secondPart.className = 'second'
    topButtons.append(secondPart)

    const addButton = document.createElement('div')
    addButton.className = 'add cursor-p'
    addButton.title = getTranslation('addItem')
    addButton.onclick = () => {
        const li = createFreshListItem(list)
        document.querySelector('.list-container')?.prepend(createListItem(li))
    }
    secondPart.appendChild(addButton)

    return topButtons
}

/**
 * 
 * @param {ListItem} listItem 
 * @returns {HTMLDivElement}
 */
const createListItem = (listItem) => {
    const liContainer = document.createElement('div')
    liContainer.className = 'li-container'

    const labelSelectPicButton = document.createElement('label')
    labelSelectPicButton.className = 'select-pic cursor-p'
    labelSelectPicButton.htmlFor = `select-pic-${listItem.id}`
    labelSelectPicButton.title = getTranslation('selectPic')
    liContainer.appendChild(labelSelectPicButton)

    const selectPicButton = document.createElement('input')
    selectPicButton.id = `select-pic-${listItem.id}`
    selectPicButton.type = 'file'
    selectPicButton.accept = '.jpg, .jpeg, .png, image/jpeg, image/png'
    selectPicButton.onchange = (e) => {
        if (!selectPicButton.files) return
        const img = selectPicButton.files.item(0)
        if (!img) return
        const imgEl = document.createElement('img')
        imgEl.src = URL.createObjectURL(img)
        labelSelectPicButton.textContent = ''
        labelSelectPicButton.appendChild(imgEl)
        listItem.imgEl = imgEl
        if (listItem.description.trim().length) select.style.display = ''
    }
    liContainer.appendChild(selectPicButton)

    const textInput = document.createElement('input')
    textInput.className = 'text'
    textInput.setAttribute('autocomplete', 'false')
    textInput.oninput = () => {
        listItem.description = textInput.value
        if (!listItem.description.trim().length) select.style.display = 'none'
        else if (listItem.imgEl) select.style.display = ''
    }
    liContainer.appendChild(textInput)

    const select = document.createElement('select')
    if (!listItem.description.trim().length) select.style.display = 'none'
    liContainer.appendChild(select)
    const option1 = document.createElement('option')
    option1.value = 'start'
    option1.text = getTranslation('start')
    option1.selected = (listItem.descriptionPosition === 'start')
    select.appendChild(option1)
    const option2 = document.createElement('option')
    option2.value = 'center'
    option2.text = getTranslation('center')
    option2.selected = (listItem.descriptionPosition === 'center')
    select.appendChild(option2)
    const option3 = document.createElement('option')
    option3.value = 'end'
    option3.text = getTranslation('end')
    option3.selected = (listItem.descriptionPosition === 'end')
    select.appendChild(option3)

    return liContainer
}

/**
 * 
 * @param {List} list 
 * @returns {HTMLDivElement}
 */
const createList = (list) => {
    const listContainer = document.createElement('div')
    listContainer.className = 'list-container'

    return listContainer
}

const renderMainMenu = () => {
    /** @type {List} */
    const list = []

    container.textContent = ''
    container.append(createTopMenu(list))
    container.append(createList(list))
}

renderMainMenu()