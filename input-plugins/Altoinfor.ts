import {UniversalDataFormatItems} from "../interfaces/UniversalDataFormatItems"

import * as https from 'https';
import {createWriteStream} from 'fs';
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

    async #download() {
        let bytesDownloaded = 0;

        console.log('Connecting...')
        const array = await axios.get(this.url, {
            responseEncoding: 'utf-8',
            responseType: 'stream',
            httpsAgent: new https.Agent({rejectUnauthorized: false}),
        });

        let totalLength = array.headers['content-length'] ? array.headers['content-length'] : 1000;

        const progressBar = new SingleBar({
            barsize: 25,
            format: `${BarColors.cyan('[Altoinfor]')} Downloading CSV |${BarColors.cyan('{bar}')}| {percentage}% | {value}/{total} Chunks`
        }, Presets.shades_classic);
        progressBar.start(totalLength, 0);


        const writer = createWriteStream(
            Path.resolve(__dirname + '/../downloads/', `temp.csv`)
        )

        array.data.on('data', (chunk) => {
            bytesDownloaded += chunk.length

            let multiplier = Math.floor(Math.random() * (5 - 1)) + 1;

            if (totalLength < bytesDownloaded) {
                totalLength = bytesDownloaded * multiplier;
                progressBar.setTotal(bytesDownloaded * multiplier)
            }

            progressBar.increment(chunk.length)
        })

        array.data.on('end', () => {

            progressBar.setTotal(bytesDownloaded);
            progressBar.stop()

            console.log(`\nTotal bytes:${bytesDownloaded}`)
            console.log('\nDownload completed!');


        })

        array.data.pipe(writer)
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
     * jsonToUniversalDataFormatItems - converts an Array in json into UniversalDataFormatItems
     * @param data
     * @private
     */
    async #jsonToUniversalDataFormatItems(data: any, categories: UniversalDataFormatCategories[]): Promise<UniversalDataFormatItems[]> {
        return new Promise(async (resolve, reject) => {

            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.cyan('[Altoinfor]')} Getting items      |${BarColors.cyan('{bar}')}| {percentage}% | {value}/{total} Chunks`
            }, Presets.shades_classic);

            for (let i in data.Sheets) {

                let range = this.#sheetLimitRange(data.Sheets[i])
                progressBar.start(range, 0);

                let artigos: Array<UniversalDataFormatItems> = [];

                //linhas
                for (let j = 1; j <= range; j++) {

                    //let id_familia: number = await this.#getCategoryIDPerItem(categories, data.Sheets[i], j);

                    artigos.push({
                        id_category: 0,
                        bar_code: (data.Sheets[i][`U${j}`]) ? data.Sheets[i][`U${j}`].v : '',
                        brand: (data.Sheets[i][`E${j}`]) ? data.Sheets[i][`E${j}`].v : '',
                        category: (data.Sheets[i][`B${j}`]) ? data.Sheets[i][`B${j}`].v : '',
                        description: (data.Sheets[i][`F${j}`]) ? data.Sheets[i][`F${j}`].v : '',
                        description_short: (data.Sheets[i][`G${j}`]) ? data.Sheets[i][`G${j}`].v : '',
                        description_long: (data.Sheets[i][`W${j}`]) ? data.Sheets[i][`W${j}`].v : '',
                        id: (data.Sheets[i][`A${j}`]) ? data.Sheets[i][`A${j}`].v : '',
                        image: (data.Sheets[i][`V${j}`]) ? data.Sheets[i][`V${j}`].v : '',
                        min_sell: (data.Sheets[i][`I${j}`]) ? data.Sheets[i][`I${j}`].v : 0,
                        pvp_1: (data.Sheets[i][`J${j}`]) ? data.Sheets[i][`J${j}`].v : 0,
                        pvp_2: (data.Sheets[i][`N${j}`]) ? data.Sheets[i][`N${j}`].v : 0,
                        stock: (data.Sheets[i][`O${j}`]) ? data.Sheets[i][`O${j}`].v : '',
                        weight: (data.Sheets[i][`R${j}`]) ? data.Sheets[i][`R${j}`].v : 0
                    })
                    progressBar.increment(1)
                }

                artigos.shift();
                progressBar.stop();
                resolve(artigos)
            }
        })
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
                format: `${BarColors.cyan('[Altoinfor]')} Getting categories |${BarColors.cyan('{bar}')}| {percentage}% | {value}/{total} Chunks`
            }, Presets.shades_classic);

            for (let i in data.Sheets) {

                let range = this.#sheetLimitRange(data.Sheets[i])
                progressBar.start(range, 0);

                let categories: Array<UniversalDataFormatCategories> = []


                let id: number = 1;
                let parent: number = 0;

                //linhas
                for (let j = 1; j <= range; j++) {
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
                debugger
            }
            debugger
            resolve({"compare": compare, "parent": parent});
        });
    }

    async #addCategory(categories: UniversalDataFormatCategories[], parent: number, id: number, data: any, index: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let temp: UniversalDataFormatCategories = {id: 0, name: "", parent: 0}
            let exists: any = 0;

            temp = {
                id: id,
                name: (data[`B${index}`]) ? data[`B${index}`].v : '',
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

            temp = {
                id: id,
                name: (data[`C${index}`]) ? data[`C${index}`].v : '',
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

            temp = {
                id: id,
                name: (data[`D${index}`]) ? data[`D${index}`].v : '',
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
                //await this.#download();
                let json = await this.#csvToJson();
                let categories = await this.#jsonToUniversalDataFormatCategories(json);
                let items = await this.#jsonToUniversalDataFormatItems(json, categories);

                let universalData: UniversalDataFormat = {categories: categories, items: items}

                resolve(universalData)
            } catch (e) {
                reject(e)
            }
        })
    }
}

export {Altoinfor}