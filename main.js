// @ts-check
import { getTranslation } from "./translate.js"

/** @type {HTMLDivElement} */ // @ts-expect-error
export const container = document.getElementById('container')

const createTopMenu = () => {
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
    secondPart.appendChild(addButton)

    return topButtons
}

const renderMainMenu = () => {
    container.textContent = ''
    container.append(createTopMenu())
}

renderMainMenu()