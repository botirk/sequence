// @ts-check
import { getTranslation } from "./translate.js"

/**
 * @typedef {Object} ListItem
 * @prop {number} id
 * @prop {string|void} imgUrl
 * @prop {HTMLImageElement|void} imgEl
 * @prop {string} description
 * @prop {'start'|'center'|'end'|string} descriptionPosition
 * @prop {'black'|'white'|'red'|'blue'|'green'|string} descriptionColor
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
        descriptionColor: 'black',
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

    const labelSelectZipButton = document.createElement('label')
    labelSelectZipButton.className = 'cursor-p'
    labelSelectZipButton.htmlFor = 'select-zip'
    labelSelectZipButton.title = getTranslation('selectFolder')
    firstPart.appendChild(labelSelectZipButton)

    const selectZipButton = document.createElement('input')
    selectZipButton.id = 'select-zip'
    selectZipButton.type = 'file'
    selectZipButton.accept = '.zip, application/zip, application/x-zip-compressed'
    selectZipButton.onchange = (e) => {
        if (!selectZipButton.files) return
    }
    firstPart.appendChild(selectZipButton)

    const saveButton = document.createElement('button')
    saveButton.type = 'button'
    saveButton.className = 'save cursor-p'
    saveButton.title = getTranslation('saveFolder')
    firstPart.appendChild(saveButton)

    const secondPart = document.createElement('div')
    secondPart.className = 'second'
    topButtons.append(secondPart)

    const addButton = document.createElement('button')
    addButton.type = 'button'
    addButton.className = 'add cursor-p'
    addButton.title = getTranslation('addItem')
    addButton.onclick = () => {
        const li = createFreshListItem(list)
        document.querySelector('.list-container')?.prepend(createListItem(li, list))
        updateArrows()
    }
    secondPart.appendChild(addButton)

    return topButtons
}

const updateArrows = () => {
    const lc = document.querySelector('.list-container')
    if (!lc) return
    for (const i in Array.from(lc.children)) {
        // @ts-expect-error
        lc.children[i].querySelector('.up').disabled = (parseInt(i) <= 0)
        // @ts-expect-error
        lc.children[i].querySelector('.down').disabled = (parseInt(i) + 1 >= lc.children.length)
    }
}

/**
 * 
 * @param {ListItem} listItem 
 * @param {List} listOwner
 * @returns {HTMLDivElement}
 */
const createListItem = (listItem, listOwner) => {
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
        if (listItem.description.trim().length) {
            selectPos.disabled = false
            selectColor.disabled = false
        }
    }
    liContainer.appendChild(selectPicButton)

    const textInput = document.createElement('input')
    textInput.className = 'text'
    textInput.title = getTranslation('fillDesc')
    textInput.setAttribute('autocomplete', 'false')
    textInput.oninput = () => {
        listItem.description = textInput.value
        if (!listItem.description.trim().length) {
            selectPos.disabled = true
            selectColor.disabled = true
        } else if (listItem.imgEl) {
            selectPos.disabled = false
            selectColor.disabled = false
        }
    }
    liContainer.appendChild(textInput)

    const selectGroup = document.createElement('div')
    selectGroup.className = 'select-group'
    liContainer.appendChild(selectGroup)

    const selectPos = document.createElement('select')
    selectPos.title = getTranslation('selectTextPos')
    if (!listItem.description.trim().length || !listItem.imgEl) selectPos.disabled = true
    selectGroup.appendChild(selectPos)
    {
        const option1 = document.createElement('option')
        option1.value = 'start'
        option1.text = getTranslation('start')
        option1.selected = (listItem.descriptionPosition === 'start')
        selectPos.appendChild(option1)
        const option2 = document.createElement('option')
        option2.value = 'center'
        option2.text = getTranslation('center')
        option2.selected = (listItem.descriptionPosition === 'center')
        selectPos.appendChild(option2)
        const option3 = document.createElement('option')
        option3.value = 'end'
        option3.text = getTranslation('end')
        option3.selected = (listItem.descriptionPosition === 'end')
        selectPos.appendChild(option3)
    }

    const selectColor = document.createElement('select')
    selectColor.title = getTranslation('selectTextColor')
    if (!listItem.description.trim().length || !listItem.imgEl) selectColor.disabled = true
    selectGroup.appendChild(selectColor)
    {
        for (const color of ['black', 'white', 'red', 'green', 'yellow', 'blue']) {
            const option = document.createElement('option')
            option.value = color
            // @ts-expect-error such type
            option.text = getTranslation(color)
            option.selected = (listItem.descriptionPosition === 'start')
            selectColor.appendChild(option)
        }
    }

    const arrowGroup = document.createElement('div')
    arrowGroup.className = 'arrow-group'
    liContainer.appendChild(arrowGroup)

    const up = document.createElement('button')
    up.type = 'button'
    up.className = 'up'
    up.title = getTranslation('moveUp')
    up.onclick = () => {
        const parent = liContainer.parentElement
        if (!parent) return
        const children = Array.from(liContainer.parentElement.children)
        const i = children.indexOf(liContainer)
        if (i <= 0) return
        liContainer.remove()
        parent.insertBefore(liContainer, children[i - 1])
        updateArrows()

        listOwner.splice(i, 1)
        listOwner.splice(i - 1, 0, listItem)
    }
    arrowGroup.appendChild(up)

    const deleteBtn = document.createElement('button')
    deleteBtn.type = 'button'
    deleteBtn.className = 'delete'
    deleteBtn.title = getTranslation('deleteItem')
    deleteBtn.onclick = () => {
        const i = listOwner.indexOf(listItem)
        if (i >= 0) listOwner.splice(i, 1)
        liContainer.remove()
    }
    arrowGroup.appendChild(deleteBtn)


    const down = document.createElement('button')
    down.type = 'button'
    down.className = 'down'
    down.title = getTranslation('moveDown')
    down.onclick = () => {
        const parent = liContainer.parentElement
        if (!parent) return
        const children = Array.from(liContainer.parentElement.children)
        const i = children.indexOf(liContainer)
        if (children.length <= 1 || i >= children.length - 1) return
        liContainer.remove()
        parent.insertBefore(liContainer, children[i + 2])
        updateArrows()

        listOwner.splice(i, 1)
        listOwner.splice(i + 1, 0, listItem)
    }
    arrowGroup.appendChild(down)

    const i = listOwner.indexOf(listItem)
    up.disabled = (i <= 0)
    down.disabled = (i + 1 >= listOwner.length)

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