// @ts-check

const translationRu = {
    selectFolder: 'Выбрать папку',
    saveFolder: 'Сохранить папку',
    addItem: 'Добавить предмет'
}

/**
 * 
 * @param {keyof translationRu} key
 * @returns {string}
 */
export const getTranslation = (key) => {
    return translationRu[key]
}