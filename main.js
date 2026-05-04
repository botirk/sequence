// @ts-check
import './assets/jszip.min.js'
import { getTranslation } from './translate.js'

// @ts-expect-error
const JSZip = /** @type {any} */ window.JSZip;

/**
 * @typedef {Object} ListItem
 * @prop {number} id
 * @prop {File|void} imgFile
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
        imgFile: undefined,
    }

    list.push(result)
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
    selectZipButton.onchange = async (e) => {
        if (!selectZipButton.files) return
        const file = selectZipButton.files[0]
        if (!file.name.endsWith('.zip')) {
            alert(getTranslation('notZip'))
            return
        }
        try {
            renderMainMenu(await loadList(file))
        } catch (e) {
            console.error(e)
            alert(getTranslation('unzipError'))
        }
         
        
    }
    firstPart.appendChild(selectZipButton)

    const saveButton = document.createElement('button')
    saveButton.type = 'button'
    saveButton.className = 'save cursor-p'
    saveButton.title = getTranslation('saveFolder')
    saveButton.onclick = async () => {
        try {
            saveList(list)
        } catch (e) {
            console.error(e)
            alert(getTranslation('zipError'))
        }
        
    }
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
        const liEl = createListItem(li, list)
        document.querySelector('.list-container')?.append(liEl)
        updateArrows()
        liEl.scrollIntoView()
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
    selectPicButton.onchange = () => {
        if (!selectPicButton.files) return
        const img = selectPicButton.files[0]
        if (!img) return
        const imgEl = document.createElement('img')
        imgEl.src = URL.createObjectURL(img)
        imgEl.draggable = false
        labelSelectPicButton.textContent = ''
        labelSelectPicButton.appendChild(imgEl)
        listItem.imgFile = img
        if (listItem.description.trim().length) {
            selectPos.disabled = false
            selectColor.disabled = false
        }
        switchPicUpload()
    }
    if (listItem.imgFile) {
        const imgEl = document.createElement('img')
        imgEl.src = URL.createObjectURL(listItem.imgFile)
        imgEl.draggable = false
        labelSelectPicButton.appendChild(imgEl)
    }
    liContainer.appendChild(selectPicButton)

    const switchPicUpload = () => {
        labelSelectPicButton.title = getTranslation('deletePic')
        selectPicButton.disabled = true
        labelSelectPicButton.onpointerup = (e) => {
            e.stopImmediatePropagation()
            labelSelectPicButton.querySelector('img')?.remove()
            listItem.imgFile = undefined
            selectPos.disabled = true
            selectColor.disabled = true
            selectPicButton.disabled = false
            labelSelectPicButton.title = getTranslation('selectPic')
        }
    }

    const textInput = document.createElement('input')
    textInput.value = listItem.description
    textInput.size = 1
    textInput.className = 'text'
    textInput.title = getTranslation('fillDesc')
    textInput.setAttribute('autocomplete', 'false')
    textInput.oninput = () => {
        listItem.description = textInput.value
        if (!listItem.description.trim().length) {
            selectPos.disabled = true
            selectColor.disabled = true
        } else if (listItem.imgFile) {
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
    selectPos.onchange = () => listItem.descriptionPosition = selectPos.value
    if (!listItem.description.trim().length || !listItem.imgFile) selectPos.disabled = true
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
    selectColor.onchange = () => listItem.descriptionColor = selectPos.value
    if (!listItem.description.trim().length || !listItem.imgFile) selectColor.disabled = true
    selectGroup.appendChild(selectColor)
    for (const color of ['black', 'white', 'red', 'green', 'yellow', 'blue']) {
        const option = document.createElement('option')
        option.value = color
        // @ts-expect-error such type
        option.text = getTranslation(color)
        option.selected = (listItem.descriptionPosition === color)
        selectColor.appendChild(option)
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
        updateArrows()
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

    for (const listItem of list) {
        listContainer.appendChild(createListItem(listItem, list))
    }

    return listContainer
}

/**
 * 
 * @param {List} list 
 */
const saveList = async (list) => {
    const enableAll = disableAll()
    try {
        const filteredList = list.filter((li) => li.description.trim() || li.imgFile)
        const listWithoutFiles = filteredList.map(li => ({ ...li, imgFile: (li.imgFile ? `${li.id}.${li.imgFile.name.split('.').pop()}` : undefined) }))

        const zip = new JSZip()
        zip.file('list.json', JSON.stringify(listWithoutFiles))

        for (const i in listWithoutFiles) {
            if (listWithoutFiles[i].imgFile)
                zip.file(listWithoutFiles[i].imgFile, filteredList[i].imgFile)
        }

        const content = await zip.generateAsync({type: 'blob'})

        const link = document.createElement('a')
        link.href = URL.createObjectURL(content)
        link.download = "sequence.zip"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
    } finally {
        enableAll()
    }
}

/**
 * 
 * @param {File} zipFile
 * @returns {Promise<List>}
 */
const loadList = async (zipFile) => {
    const enableAll = disableAll()
    
    try {
        const zip = new JSZip()
        const files = Object.values((await zip.loadAsync(zipFile)).files)
        const jsonFile = JSON.parse(await files.find(file => file.name === 'list.json').async('text'))

        if (!(jsonFile instanceof Array)) throw new Error('JSON not array')

        const result = []
        for (const item of jsonFile) {
            if (item.imgFile) {
                if (typeof(item.imgFile) !== 'string') throw new Error('zipFile is not a string')
                const jsZipFile = files.find(file => file.name === item.imgFile)
                item.imgFile = await files.find(file => file.name === item.imgFile).async('blob')
                item.imgFile.name = jsZipFile.name
            }

            if (typeof(item.id) !== 'number') throw new Error('id is not a number')
            if (typeof(item.description) !== 'string') throw new Error('description is not a string')
            if (typeof(item.descriptionPosition) !== 'string') throw new Error('descriptionPosition is not a string')
            if (typeof(item.descriptionColor) !== 'string') throw new Error('descriptionColor is not a string')
            result.push({ imgFile: item.imgFile, id: item.id, description: item.description, descriptionPosition: item.descriptionPosition, descriptionColor: item.descriptionColor })
        }

        return result
    } finally {
        enableAll()
    }
}

const disableAll = () => {
    const items = Array.from(document.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled])'))

    for (const item of items) item.setAttribute('disabled', 'true')

    return () => {
        for (const item of items) item.removeAttribute('disabled')
    }
}

/**
 * 
 * @param {List} list 
 */
const renderMainMenu = (list = []) => {
    container.textContent = ''
    container.append(createList(list))
    container.append(createTopMenu(list))
}

renderMainMenu()