import {UniversalDataFormatItems} from "../interfaces/UniversalDataFormatItems"

import * as https from 'https';
import {createWriteStream, writeFile} from 'fs';
import axios from 'axios';
import * as BarColors from 'ansi-colors'
import {SingleBar, Presets} from 'cli-progress'
import * as Path from "path";
import * as XLSX from "xlsx";
import {UniversalDataFormat} from "../interfaces/UniversalDataFormat";
import {UniversalDataFormatCategories} from "../interfaces/UniversalDataFormatCategories";


class Altoinfor {
    url: string = ""

    constructor(config: any) {
        this.url = config.url + config.clientID
    }

    async #download(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let bytesDownloaded = 0;

            process.stdout.write(`${BarColors.cyan('[Altoinfor]')} Connecting... `);
            const array = await axios.get(this.url, {
                responseEncoding: 'utf-8',
                responseType: 'stream',
                httpsAgent: new https.Agent({rejectUnauthorized: false}),
            });

            console.log(`${BarColors.cyan('Done')}`);

            let totalLength = array.headers['content-length'] ? array.headers['content-length'] : 1000;

            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.cyan('[Altoinfor]')} Downloading CSV      |${BarColors.cyan('{bar}')}| | {percentage}% | {value}/{total} Chunks | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);
            progressBar.start(totalLength, 0);


            const writer = createWriteStream(
                Path.resolve(__dirname + '/../downloads/', `temp.csv`)
            )

            try {
                array.data.on('data', (chunk) => {
                    bytesDownloaded += chunk.length

                    let multiplier = Math.floor(Math.random() * (6 - 1)) + 1;

                    if (totalLength < bytesDownloaded) {
                        totalLength = bytesDownloaded * multiplier;
                        progressBar.setTotal(bytesDownloaded * multiplier)
                    }

                    progressBar.increment(chunk.length)
                })

                array.data.on('end', () => {

                    progressBar.setTotal(bytesDownloaded);
                    progressBar.stop()

                    resolve(true)

                })

                array.data.pipe(writer)
            } catch (e) {
                reject(e)
            }

        })
    }

    async #csvToJson() {
        return new Promise((resolve, reject) => {
            process.stdout.write(`${BarColors.cyan('[Altoinfor]')} Converting csv into JSON... `);

            let workbook = XLSX.readFile(`${__dirname}/../downloads/temp.csv`)

            console.log(`${BarColors.cyan('Done')}`);
            resolve(workbook)
        })
    }

    /**
     * jsonToUniversalDataFormatItems - converts an Array in json to UniversalDataFormatItems
     * @param data
     * @private
     */
    async #jsonToUniversalDataFormatItems(data: any, categories: UniversalDataFormatCategories[]): Promise<UniversalDataFormatItems[]> {
        return new Promise(async (resolve, reject) => {

            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.cyan('[Altoinfor]')} Getting items        |${BarColors.cyan('{bar}')}| {percentage}% | {value}/{total} | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            for (let i in data.Sheets) {

                let range = this.#sheetLimitRange(data.Sheets[i])
                progressBar.start(range, 0);

                let products: Array<UniversalDataFormatItems> = [];

                //linhas

                for (let j = 1; j <= range; j++) {

                    let family_id: number = await this.#getCategoryIDPerItem(categories, data.Sheets[i], j);

                    products.push({
                        id_category: family_id,
                        bar_code: (data.Sheets[i][`U${j}`]) ? data.Sheets[i][`U${j}`].v : '',
                        brand: (data.Sheets[i][`E${j}`]) ? data.Sheets[i][`E${j}`].v : '',
                        category: (data.Sheets[i][`D${j}`]) ? data.Sheets[i][`D${j}`].v : '',
                        description: (data.Sheets[i][`F${j}`]) ? data.Sheets[i][`F${j}`].v : '',
                        description_short: (data.Sheets[i][`G${j}`]) ? data.Sheets[i][`G${j}`].v : '',
                        description_long: (data.Sheets[i][`W${j}`]) ? data.Sheets[i][`W${j}`].v : '',
                        id: (data.Sheets[i][`A${j}`]) ? data.Sheets[i][`A${j}`].v : '',
                        image: (data.Sheets[i][`V${j}`]) ? data.Sheets[i][`V${j}`].v : '',
                        min_sell: (data.Sheets[i][`I${j}`]) ? data.Sheets[i][`I${j}`].v : 0,
                        pvp_1: (data.Sheets[i][`J${j}`]) ? data.Sheets[i][`J${j}`].v : 0,
                        pvp_2: (data.Sheets[i][`N${j}`]) ? data.Sheets[i][`N${j}`].v : 0,
                        stock: (data.Sheets[i][`O${j}`]) ? parseInt(data.Sheets[i][`O${j}`].v.toString().split("--")[1]) : 0,
                        weight: (data.Sheets[i][`R${j}`]) ? data.Sheets[i][`R${j}`].v : 0
                    })
                    progressBar.increment(1)
                }

                products.shift();
                progressBar.stop();

                process.stdout.write(`${BarColors.cyan('[Altoinfor]')} Saving debug file for products... `);
                writeFile("debug/Altoinfor/products.json", JSON.stringify(products), err => {
                    if (err) {
                        console.error(err)
                    }
                });
                console.log(`${BarColors.cyan('Done')}`);

                resolve(products)
            }
        })
    }

    /**
     * getCategoryIDPerItem - This function it will associate a category (id) to an item (id_category).
     *                        For that, it will go through every category already created and search for the right category
     * @param categories
     * @param item
     * @param index
     * @private
     */
    async #getCategoryIDPerItem(categories: UniversalDataFormatCategories[], item: object, index: number): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let temp: UniversalDataFormatCategories = {id: 0, name: "", parent: 0};
            let categoriesForItems: Array<UniversalDataFormatCategories> = [];
            let id: number = 1;
            let parent: number = 0;

            const tempCategories = await this.#addCategory(categoriesForItems, parent, id, item, index)

            temp = tempCategories.categories;

            for (let i in categories) {
                if (categories[i].parent === 0 && categories[i].name === temp[0].name) {
                    temp[0].id = categories[i].id;
                    temp[1].parent = categories[i].id;
                    const child: UniversalDataFormatCategories[] = categories.filter((obj) => {
                        return obj.parent === temp[1].parent && obj.name === temp[1].name
                    })
                    temp[2].parent = child[0].id;
                    temp[1].id = child[0].id;
                    const grandChild: UniversalDataFormatCategories[] = categories.filter((obj) => {
                        return obj.parent === temp[2].parent && obj.name === temp[2].name
                    })
                    temp[2].id = grandChild[0].id;
                }
            }

            resolve(temp[2].id)
        });
    }

    /**
     * jsonToUniversalDataFormatCategories - converts an Array in json into UniversalDataFormatCategories
     * @param data
     * @private
     */
    async #jsonToUniversalDataFormatCategories(data): Promise<UniversalDataFormatCategories[]> {
        return new Promise(async (resolve, reject) => {

            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.cyan('[Altoinfor]')} Getting categories   |${BarColors.cyan('{bar}')}| {percentage}% | {value}/{total} | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            for (let i in data.Sheets) {

                let range = this.#sheetLimitRange(data.Sheets[i])
                //Removes 1 from range because, the first 2 lines on the CSV are a blank line and the header,
                // in the previous function we remove the blank one, and now we need to say to the progress bar that we need to remove one more (the header one)
                progressBar.start(range - 1, 0);

                let categories: Array<UniversalDataFormatCategories> = []

                let id: number = 1;
                let parent: number = 0;

                //linhas
                //It starts on 2 because the first 2 lines on the CSV are a blank line and the header
                for (let j = 2; j <= range; j++) {
                    try {
                        const insertCategories = await this.#addCategory(categories, parent, id, data.Sheets[i], j)

                        id = insertCategories.newid;
                        categories = insertCategories.categories;

                        progressBar.increment(1)
                    } catch (e) {
                        console.log(e)
                    }
                }
                progressBar.stop();

                process.stdout.write(`${BarColors.cyan('[Altoinfor]')} Saving debug file for categories... `);
                writeFile("debug/Altoinfor/categories.json", JSON.stringify(categories), err => {
                    if (err) {
                        console.error(err)
                    }
                });
                console.log(`${BarColors.cyan('Done')}`);

                resolve(categories)
            }
        })
    }

    /**
     * compareCategories - Compares the existence of a category
     * @param categories
     * @param newCategory
     * @private
     */
    async #compareCategories(categories: UniversalDataFormatCategories[], newCategory: UniversalDataFormatCategories): Promise<object> {
        return new Promise((resolve, reject) => {
            let compare: boolean = false;
            let parent: number = 0;
            //checks if the categories array is empty or not
            if (categories.length !== 0) {
                //If not empty, loops
                for (let i in categories) {
                    if (categories[i].parent === newCategory.parent) {
                        compare = categories[i].name === newCategory.name
                        parent = categories[i].id
                    }
                }
            }
            resolve({"compare": compare, "parent": parent});
        });
    }

    /**
     * addCategory - It will search if the category exists and if not it will merge into the categories list
     * @param categories
     * @param parent
     * @param id
     * @param data
     * @param index
     * @private
     */
    async #addCategory(categories: UniversalDataFormatCategories[], parent: number, id: number, data: any, index: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let temp: UniversalDataFormatCategories = {id: 0, name: "", parent: 0}
            let exists: any = 0;
            let name: any = '';

            //Family
            name = ((data[`B${index}`]) ? data[`B${index}`].v : '').split(" ");

            name = name.filter(function (el) {
                return el;
            });
            name = name.join(" ").trim();

            temp = {
                id: id,
                name: name,
                parent: parent
            }

            exists = await this.#compareCategories(categories, temp)

            if (!exists.compare) {
                categories.push({
                    id: id,
                    name: temp.name,
                    parent: 0
                })
                parent = id
                id++
            } else {
                parent = exists.parent
            }

            //Sub-Family
            name = ((data[`C${index}`]) ? data[`C${index}`].v : '').split(" ");

            name = name.filter(function (el) {
                return el;
            });
            name = name.join(" ").trim();

            temp = {
                id: id,
                name: name,
                parent: parent
            }

            exists = await this.#compareCategories(categories, temp)

            if (!exists.compare) {
                categories.push({
                    id: id,
                    name: temp.name,
                    parent: parent
                })
                parent = id
                id++
            } else {
                parent = exists.parent
            }

            //Sub-Sub-Family
            name = ((data[`D${index}`]) ? data[`D${index}`].v : '').split(" ");

            name = name.filter(function (el) {
                return el;
            });

            name = name.join(" ").trim();

            temp = {
                id: id,
                name: name,
                parent: parent
            }

            //exists = await this.#compareCategories(categories, temp)

            let filterGrandChildren = categories.filter(function (el) {
                return (el.name === temp.name && temp.parent === el.parent)
            })

            if (filterGrandChildren.length === 0) {
                if (temp.name === 'Hp Original') {
                    console.log('temp', temp)
                    console.log(filterGrandChildren)
                    debugger
                }
                categories.push({
                    id: id,
                    name: temp.name,
                    parent: parent
                })
                parent = id
                id++
            } else {
                exists = await this.#compareCategories(categories, temp)
                parent = exists.parent
            }

            resolve({categories: categories, newid: id})
        })
    }

    #sheetLimitRange(data): number {
        //Check the range limit off the sheet (start and end like A1:V15)
        const arrayDivided = data['!ref'].split(":");
        let range = {
            totalLines: 0
        }

        Object.keys(arrayDivided).forEach((value, index, array) => {
            let match = arrayDivided[value].match(/[a-zA-Z]+|[0-9]+/g)
            range.totalLines = match[1]
        });

        return range.totalLines;
    }

    async execute(): Promise<UniversalDataFormat> {
        return new Promise(async (resolve, reject) => {
            try {
                // await this.#download().then(async () => {
                let json = await this.#csvToJson();
                let categories = await this.#jsonToUniversalDataFormatCategories(json);
                //let items = await this.#jsonToUniversalDataFormatItems(json, categories);
                let items: UniversalDataFormatItems[] = [{
                    "id_category": 3,
                    'bar_code': '3259920015251',
                    "brand": "DAMMANN FRÈRES",
                    "category": "Acessorios",
                    "description": "Filtro de Chá Descartável para Bule 64un",
                    "description_short": "Filtro de Chá Descartável para Bule 64un",
                    "description_long": "Estes filtros universais para chá são adequados para todos os tipos de chá a granel. De sabor neutro, permitem a infusão de chás de folhas ou chás de ervas. Resistente, o papel não se desfaz mesmo depois de muito tempo embebido em água. Ideal para al préaração do infusor em bule, podendo ser utilizado também em xícara alta.",
                    "id": '6591525',
                    "image": "http://www.netimagens.com/images/produtos/6591525.jpg",
                    "min_sell": 1,
                    "pvp_1": 4.45,
                    "pvp_2": 0,
                    "stock": 10,
                    "weight": 0.06
                },
                    {
                        "id_category": 3,
                        "bar_code": '3259920015251',
                        "brand": "DAMMANN FRÈRES",
                        "category": "Acessorios",
                        "description": "Filtro de Chá Descartável para Bule 64un",
                        "description_short": "Filtro de Chá Descartável para Bule 64un",
                        "description_long": "Estes filtros universais para chá são adequados para todos os tipos de chá a granel. De sabor neutro, permitem a infusão de chás de folhas ou chás de ervas. Resistente, o papel não se desfaz mesmo depois de muito tempo embebido em água. Ideal para al préaração do infusor em bule, podendo ser utilizado também em xícara alta.",
                        "id": '6591525',
                        "image": "http://www.netimagens.com/images/produtos/6591525.jpg",
                        "min_sell": 1,
                        "pvp_1": 4.45,
                        "pvp_2": 0,
                        "stock": 10,
                        "weight": 0.06
                    }];
                let universalData: UniversalDataFormat = {categories: categories, items: items}
                resolve(universalData)


                // });
            } catch (e) {
                reject(e)
            }
        })
    }
}

export {Altoinfor}