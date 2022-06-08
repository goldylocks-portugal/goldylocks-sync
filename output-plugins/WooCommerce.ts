import {UniversalDataFormatItems} from "../interfaces/UniversalDataFormatItems";
import {UniversalDataFormatCategories} from "../interfaces/UniversalDataFormatCategories";
import * as BarColors from 'ansi-colors'
import {SingleBar, Presets} from 'cli-progress'

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {UniversalDataFormat} from "../interfaces/UniversalDataFormat";
import {Debugger} from "inspector";
import {escape} from "querystring";

interface categoryIndexArray {
    originalID: string,
    woocommerceID: string
}

class WooCommerce {
    private _WooCommerce: any = {};
    private _allCategories: categoryIndexArray[] = [{
        originalID: "0", woocommerceID: "0"
    }];
    private _universalDataFormat: any

    constructor(config: any, data: any) {
        process.stdout.write(`${BarColors.magenta('[WooCommerce]')} Connecting... `);
        this._WooCommerce = new WooCommerceRestApi({
            url: config.url,
            consumerKey: config.consumerKey,
            consumerSecret: config.consumerSecret,
            version: config.version
        });
        this._universalDataFormat = data;
        console.log(`${BarColors.magenta('Done')}`);
    }

    /**
     * insertCategories - Funtion that will check the categories, if they already exist or not, and then insert isto WooCommerce
     * @param array
     * @private
     */
    async #insertCategories(array: UniversalDataFormatCategories[]) {
        return new Promise(async (resolve, reject) => {
            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Inserting categories |${BarColors.magenta('{bar}')}| {percentage}% | {value}/{total} Categories`
            }, Presets.shades_classic);

            progressBar.start(array.length, 0);

            const perpage = 100;
            const total_pages: number = parseInt(await this.#getWooCommerceTotalCategoriesPages(perpage));

            let _wcCategories: any = [];

            for (let i = 1; i <= total_pages; i++) {
                _wcCategories.push(await this.getWooCommerceCategories(perpage, i))
            }

            for (const element of array) {

                const index = array.indexOf(element);

                const exist: any = await this.#compareCategories(_wcCategories[0], array[index])

                if (!exist.compare) {
                    //Create the new category
                    try{
                        let newID = await this.#insertCategoryIntoWooCommerce(array[index])

                        //Creat an object to be sent into the list of categories to know the original ID
                        const res: categoryIndexArray = {
                            originalID: array[index].id.toString(),
                            woocommerceID: newID.toString(),
                        }

                        //Insert the new category in the list of categories to know the original ID
                        this._allCategories.push(res)
                        progressBar.increment(1)
                    }catch (e) {
                        reject(e)
                    }
                } else {
                    progressBar.increment(1)
                }
            }

            progressBar.stop();
            resolve(true)
        });
    };

    /**
     * compareCategories - Function to compare a given category to the WooCommerce category list
     * @param array
     * @param category
     * @private
     */
    async #compareCategories(array, category): Promise<object> {
        return new Promise((resolve, reject) => {
            let compare: boolean = false;
            let parent: number = 0;

            for (let element of array) {
                let i = array.indexOf(element);
                if (category.parent === 0) {
                    if (array[i].parent === 0) {
                        compare = (array[i].name == category.name)
                        if (compare) {
                            this._allCategories.push({originalID: category.id, woocommerceID: array[i].id})
                            break
                        }
                    } else {
                        let temp = [...this._allCategories];
                        for (const element of temp) {
                            const index = temp.indexOf(element);
                            if (temp[index].originalID == category.parent) {
                                if (array[i].parent == temp[index].woocommerceID) {
                                    compare = (array[i].name == category.name)
                                    if (compare) {
                                        this._allCategories.push({originalID: category.id, woocommerceID: array[i].id})
                                        break
                                    }
                                }
                            }
                        }
                    }
                } else {
                    let temp = [...this._allCategories];
                    for (const element of temp) {
                        const index = temp.indexOf(element);
                        if (temp[index].originalID == category.parent) {
                            if (array[i].parent == temp[index].woocommerceID) {
                                compare = (array[i].name == category.name)
                                if (compare) {
                                    this._allCategories.push({originalID: category.id, woocommerceID: array[i].id})
                                    break
                                }
                            }
                        }
                    }
                }
                if (compare) {
                    break
                }
            }

            if (compare) {
                resolve({"compare": compare, "parent": parent, "nome": category.name});
            } else {
                resolve({"compare": compare, "parent": parent, "nome": category.name});
            }
        });
    }

    /**
     * insertIntoWooCommerce - Funtion to insert the category into WooCommerce
     * @param array
     * @private
     * @return Promise<number> (category id)
     */
    async #insertCategoryIntoWooCommerce(array: UniversalDataFormatCategories): Promise<number> {
        return new Promise(((resolve, reject) => {
            let parent: string = "0";
            for (const element of this._allCategories) {
                if (element.originalID === array.parent.toString()) {
                    parent = element.woocommerceID
                }
            }

            const data = {
                name: array.name,
                parent: parent
            };

            this._WooCommerce.post("products/categories", data)
                .then((response) => {
                    resolve(response.data.id)
                })
                .catch((error) => {
                    reject(error)
                });
        }))
    }

    /**
     * getWooCommerceTotalCategoriesPages - Get the number of pages to render
     * @param perpage
     * @private
     */
    async #getWooCommerceTotalCategoriesPages(perpage: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/categories/?per_page=${perpage}`)
                .then((response) => {
                    resolve(response.headers['x-wp-totalpages']);
                })
                .catch((error) => {
                    reject(error.response.data);
                });
        });
    }

    /**
     * getWooCommerceCategories - Function to extract all the existing categories from WooCommerce
     */
    async getWooCommerceCategories(perpage: number, page: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/categories/?per_page=${perpage}&page=${page}`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error.response.data);
                });
        });
    }

    /**
     * insertItems - Funtion that will associate the category to the item and then insert isto WooCommerce
     * @param array
     * @private
     */
    async #insertItems(array: UniversalDataFormatItems[]) {
        return new Promise(async (resolve, reject) => {
            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Inserting items      |${BarColors.magenta('{bar}')}| {percentage}% | {value}/{total} Items`
            }, Presets.shades_classic);
            progressBar.start(array.length, 0);
            for (let i in array) {
                let newID: string = await this.#convertItemCategory(array[i])
                array[i].id_category = parseInt(newID);
                try {
                    await this.#insertItemIntoWooCommerce(array[i])
                    progressBar.increment(1)
                } catch (e) {
                    reject(e)
                }
            }
            resolve(true)
            progressBar.stop();
        })
    }

    /**
     * insertIntoWooCommerce - Funtion to insert the category into WooCommerce
     * @param array
     * @private
     * @return Promise<number> (category id)
     */
    async #insertItemIntoWooCommerce(array: UniversalDataFormatItems): Promise<any> {
        return new Promise((async (resolve, reject) => {
            const data = {
                name: array.description,
                type: 'simple',
                regular_price: array.pvp_1.toString(),
                description: array.description_long,
                short_description: array.description_short,
                categories: [
                    {
                        id: array.id_category
                    },
                ],
                sku: array.id.toString(),
                images: [
                    {
                        src: array.image
                    }
                ]
            };
            debugger
            this._WooCommerce.post("products", data)
                .then((response) => {
                    debugger
                    resolve(response)
                })
                .catch((error) => {
                    debugger
                    reject(error.response.data.message);
                });
        }))
    }

    /**
     * convertItemCategory - Funtion to see the item category id is on WooCommerce
     * @param item
     * @private
     */
    async #convertItemCategory(item: UniversalDataFormatItems): Promise<string> {
        return new Promise((resolve, reject) => {
            let newID: string = "0";
            for (const element of this._allCategories) {
                const index = this._allCategories.indexOf(element);
                if (parseInt(this._allCategories[index].originalID) === item.id_category) {
                    newID = this._allCategories[index].woocommerceID;
                    break;
                }
            }
            resolve(newID);
        })
    }

    async execute() {
        try {
            await this.#insertCategories(this._universalDataFormat.categories)
            await this.#insertItems(this._universalDataFormat.items);
        } catch (e) {

        }
    }
}

export {WooCommerce}