

export declare interface ListItem {
    id: number,
    description: string,
    imgFile?: File,
    descriptionPosition: ('start'|'center'|'end'|string),
    descriptionColor: ('black'|'white'|'red'|'blue'|'green'|string),
}

export declare type List = ListItem[]