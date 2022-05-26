interface UniversalDataFormatItems {
    id: string,
    description_short: string,
    description: string,
    image: string,
    pvp_1: number,
    pvp_2?: number,
    pvp_3?: number,
    stock?: number,
    bar_code: string,
    min_sell?: number,
    brand?: string,
    weight?: number,
    dimensions? :{
        width: number,
        height: number,
    },
}

export {
    UniversalDataFormatItems
}
