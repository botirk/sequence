// @ts-check

const translationRu = {
    selectFolder: 'Выбрать папку',
    selectPic: 'Выбрать картинку',
    saveFolder: 'Сохранить папку',
    addItem: 'Добавить предмет',
    start: 'Верх',
    center: 'Центр',
    end: 'Низ'
}

/**
 * 
 * @param {keyof translationRu} key
 * @returns {string}
 */
export const getTranslation = (key) => {
    return translationRu[key]
}