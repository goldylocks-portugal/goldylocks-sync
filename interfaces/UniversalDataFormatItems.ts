interface UniversalDataFormatItems {
    id: string,
    description: string,
    description_short?: string,
    description_long?: string,
    image: string,
    pvp_1: number,
    pvp_2?: number,
    pvp_3?: number,
    id_category?: number,
    category?: string,
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
