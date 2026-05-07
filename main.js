// @ts-check
import './assets/jszip.min.js'
import { render, html, useState, useCallback, useEffect } from './assets/preact.mjs'

import { getTranslation } from './translate.js'
import { renderGame as renderSortGame } from './gameSort.js'

// @ts-expect-error
const JSZip = window.JSZip

/** @type {HTMLDivElement} */ // @ts-expect-error
export const container = document.getElementById('container')

/**
 * 
 * @param {{ onAddListItem: () => void, list: List, setDisabled: (state: boolean) => void, disabled: boolean }} param0 
 */
const TopMenu = ({ list, onAddListItem, setDisabled, disabled }) => {

    /** @param {Event} e */
    const onGameSelected = (e) => {

    }

    const onSave = async () => {
        try {
            setDisabled(true)
            await saveList(list)
        } catch (e) {
            console.error(e)
            alert(getTranslation('zipError'))
        } finally {
            setDisabled(false)
        }
        
    }

    /** @param {InputEvent} e */
    const inputFiles = async (e) => {
        try {
            setDisabled(true)

            /** @type {FileList|void} */ // @ts-expect-error target
            const files = e.target.files
            if (!files) return
            const file = files[0]
            if (!file?.name.endsWith('.zip')) {
                alert(getTranslation('notZip'))
                return
            }

            const list = await loadList(file)
            const params = new URLSearchParams(window.location.search)
            if (params.has('sortGame')) renderSortGame(list)
            else renderMainMenu(list)
        } catch (e) {
            console.error(e)
            alert(getTranslation('unzipError'))
        } finally {
            setDisabled(false)
        }
    }

    return html`
        <div class="top-buttons">
            <div class="first">
                <label class="cursor-p" for="select-zip" aria-label=${getTranslation('selectFolder')} title=${getTranslation('selectFolder')}></label>
                <input disabled=${disabled} id="select-zip" oninput=${inputFiles} type="file" accept=".zip, application/zip, application/x-zip-compressed" />
                <button disabled=${disabled} onclick=${onSave} type="button" class="save cursor-p" aria-label=${getTranslation('saveFolder')} title=${getTranslation('saveFolder')}></button>
            </div>
            <div class="second">
                <select onchange=${onGameSelected} class="select-game" disabled=${disabled}>
                    <option></option>
                    <option value="sortGame">${getTranslation('sortGame')}</option>
                </select>
                <button type="button" disabled=${disabled} onclick=${onAddListItem} class="add cursor-p" aria-label=${getTranslation('addItem')} title=${getTranslation('addItem')}></button>
            </div>
        </div>
    `
}

/**
 * 
 * @param {{ listItem: ListItem, disabled: boolean, first: boolean, last: boolean, onMove: (li: ListItem, change: number) => void, onDelete: (li: ListItem) => void }} param0
 */
const ListItem = ({ listItem, disabled, first, last, onMove, onDelete }) => {
    // @ts-expect-error ts bug
    const onSelectTextPos = useCallback((e) => listItem.descriptionPosition = e.target.value)
    // @ts-expect-error ts bug
    const onSelectTextColor = useCallback((e) => listItem.descriptionColor = e.target.value)

    const [desc, setDesc] = useState(listItem.description)
    listItem.description = desc
    // @ts-expect-error ts bug
    const onDescInput = useCallback((e) => setDesc(e.target.value))

    const [imgSrc, setImgSrc] = useState(listItem.imgFile ? URL.createObjectURL(listItem.imgFile) : undefined)
    useEffect(() => () => { if (imgSrc) URL.revokeObjectURL(imgSrc) }, [imgSrc])
    // @ts-expect-error ts bug
    const onSelectPic = useCallback((e) => {
        if (!e.target.files) return
        const img = e.target.files[0]
        if (!img) return
        listItem.imgFile = img
        if (imgSrc) URL.revokeObjectURL(imgSrc)
        setImgSrc(URL.createObjectURL(img))
    })
    // @ts-expect-error ts bug
    const labelOnpointerup = useCallback((e) => {
        e.stopImmediatePropagation()
        listItem.imgFile = undefined
        if (imgSrc) URL.revokeObjectURL(imgSrc)
        setImgSrc(undefined)
    })

    const moveUp = useCallback(() => onMove(listItem, -1))
    const onMyDelete = useCallback(() => onDelete(listItem))
    const moveDown = useCallback(() => onMove(listItem, 1))

    const disabledSelect = (!desc || !imgSrc)

    return html`
        <div class="li-container">
            <label class="select-pic cursor-p" onpointerup=${labelOnpointerup} for="select-pic-1" aria-label=${getTranslation('selectPic')} title=${getTranslation('selectPic')}>
                ${imgSrc ? html`<img src=${imgSrc} draggable="false" />` : null}
            </label>
            <input id="select-pic-1" onchange=${onSelectPic} type="file" accept=".jpg, .jpeg, .png, image/jpeg, image/png" />
            <input size="1" class="text" value=${desc} oninput=${onDescInput} aria-label=${getTranslation('fillDesc')} title=${getTranslation('fillDesc')} autocomplete="false" disabled=${disabled}/>
            <div class="select-group">
                <select value=${listItem.descriptionPosition} onchange=${onSelectTextPos} aria-label=${getTranslation('selectTextPos')} title=${getTranslation('selectTextPos')} disabled=${disabled || disabledSelect}>
                    <option value="start">${getTranslation('start')}</option>
                    <option value="center">${getTranslation('center')}</option>
                    <option value="end">${getTranslation('end')}</option>
                </select>
                <select value=${listItem.descriptionColor} onchage=${onSelectTextColor} aria-label=${getTranslation('selectTextColor')}  title=${getTranslation('selectTextColor')} disabled=${disabled || disabledSelect}>
                    <option value="black">${getTranslation('black')}</option>
                    <option value="white">${getTranslation('white')}</option>
                    <option value="red">${getTranslation('red')}</option>
                    <option value="green">${getTranslation('green')}</option>
                    <option value="yellow">${getTranslation('yellow')}</option>
                    <option value="blue">${getTranslation('blue')}</option>
                </select>
            </div>
            <div class="arrow-group">
                <button type="button" class="up" onclick=${moveUp} aria-label=${getTranslation('moveUp')} title=${getTranslation('moveUp')} disabled=${first || disabled}></button>
                <button type="button" class="delete" onclick=${onMyDelete} aria-label=${getTranslation('deleteItem')} title=${getTranslation('deleteItem')} disabled=${disabled}></button>
                <button type="button" class="down" onclick=${moveDown} aria-label=${getTranslation('moveDown')} title=${getTranslation('moveDown')} disabled=${last || disabled}></button>
            </div>
        </div>
    `
} 

/**
 * 
 * @param {{ list: List, disabled: boolean, onMove: (li: ListItem, change: number) => void, onDelete: (li: ListItem) => void }} param0
 */
const List = ({ list, disabled, onMove, onDelete }) => {
    return html`
        <div class="list-container">
            ${list.map(li => html`<${ListItem} key=${li.id} listItem=${li} disabled=${disabled} first=${list[0] === li} last=${list[list.length - 1] === li} onMove=${onMove} onDelete=${onDelete} />`)}
        </div>
    `
}

/**
 * 
 * @param {{ initialList: List }} param0
 */
const MainMenu = ({ initialList }) => {
    const [list, setList] = useState(initialList)
    const [disabled, setDisabled] = useState(false)

    // @ts-expect-error
    const onMove = useCallback((li, change) => {
        const i = list.indexOf(li)
        if (i < 0) return
        if (change < 0 && i > 0) {
            list.splice(i, 1)
            list.splice(i - 1, 0, li)
            setList([...list])
        } else if (change > 0 && i < list.length - 1) {
            list.splice(i, 1)
            list.splice(i + 1, 0, li)
            setList([...list])
        }
    })

    const onAddList = useCallback(() => {
        setList([...list, newListItem(list)])
        setTimeout(() => document.querySelector('.list-container')?.lastElementChild?.scrollIntoView({ behavior: 'smooth' }), 50)
        
    })

    // @ts-expect-error
    const onDelete = useCallback((li) => {
        const i = list.indexOf(li)
        if (i < 0) return
        list.splice(i, 1)
        setList([...list])    
    })
    
    return html`
        <${List} list=${list} disabled=${disabled} onMove=${onMove} onDelete=${onDelete} /> 
        <${TopMenu} setDisabled=${setDisabled} disabled=${disabled} onAddListItem=${onAddList} list=${list} />
    `
}

/**
 * @param {List} list
 * @returns {ListItem}
 */
const newListItem = (list = []) => {
    const nextId = Math.max(...list.map(li => li.id), 0) + 1

    return  {
        description: '',
        descriptionPosition: 'end',
        descriptionColor: 'black',
        id: nextId,
        imgFile: undefined,
    }
}

/**
 * 
 * @param {List} list 
 */
const saveList = async (list) => {
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
}

/**
 * 
 * @param {File} zipFile
 * @returns {Promise<List>}
 */
const loadList = async (zipFile) => {
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
}

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
 * @param {List} list
 */
export const renderMainMenu = (list = []) => {
    render(null, container)
    render(html`<${MainMenu} initialList=${list} />`, container)
}

renderMainMenu()