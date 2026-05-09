// @ts-check

const translationRu = {
    selectFolder: 'Выбрать папку',
    selectPic: 'Выбрать картинку',
    saveFolder: 'Сохранить папку',
    addItem: 'Добавить предмет',
    start: 'Верх',
    center: 'Центр',
    end: 'Низ',
    'black': 'Чёрный',
    'white': 'Белый', 
    'red': 'Красный', 
    'green': 'Зелёный', 
    'yellow': 'Жёлтый', 
    'blue': 'Синий',
    'selectTextColor': 'Выбрать цвет текста',
    'selectTextPos': 'Выбрать позицию текста',
    'moveUp': 'Переместить выше',
    'moveDown': 'Переместить ниже',
    'deleteItem': 'Удалить предмет',
    fillDesc: 'Ввести описание',
    deletePic: 'Удалить картинку',
    zipError: 'Ошибка при архивации',
    notZip: 'Не архив',
    unzipError: 'Ошибка при разархивации',
    sortGame: 'Сортировка',
    sortGameEasy: 'Сортировка(лёкгий)',
    check: 'Проверить',
    toMainMenu: 'В главное меню',
}

/**
 * 
 * @param {keyof translationRu} key
 * @returns {string}
 */
export const getTranslation = (key) => {
    return translationRu[key]
}