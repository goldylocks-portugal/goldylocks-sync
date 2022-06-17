import {UniversalDataFormatItems} from "../interfaces/UniversalDataFormatItems";
import {UniversalDataFormatCategories} from "../interfaces/UniversalDataFormatCategories";
import {writeFile} from 'fs';
import * as BarColors from 'ansi-colors'
import {SingleBar, MultiBar, Presets} from 'cli-progress'

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {UniversalDataFormat} from "../interfaces/UniversalDataFormat";
import {Debugger} from "inspector";
import {escape} from "querystring";

interface categoryIndexArray {
    originalID: string,
    woocommerceID: string
}

interface pageWcConfig {
    perpage: number,
    totalCategoriesPages: number,
    totalCategories: number
    totalProductsPages: number,
    totalProducts: number,
}

class WooCommerce {
    private _WooCommerce: any = {};
    private _allCategories: categoryIndexArray[] = [{
        originalID: "0", woocommerceID: "0"
    }];
    private _universalDataFormat: any;
    private _pageWcConfig: pageWcConfig = {
        totalProducts: 0,
        totalProductsPages: 0,
        perpage: 100,
        totalCategoriesPages: 0,
        totalCategories: 0
    }

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
     * getWooCommerceTotalCategories - Get the number of categories on WooCommerce
     * @param perpage
     * @private
     */
    async #getWooCommerceTotalCategories(perpage: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/categories/?per_page=${perpage}`)
                .then((response) => {
                    resolve(response.headers['x-wp-total']);
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
     * getWooCommerceTotalProductsPages - Get the number of pages to render
     * @param perpage
     * @private
     */
    async #getWooCommerceTotalProductsPages(perpage: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/?per_page=${perpage}`)
                .then((response) => {
                    resolve(response.headers['x-wp-totalpages']);
                })
                .catch((error) => {
                    reject(error.response.data);
                });
        });
    }

    /**
     * getWooCommerceTotalProducts - Get the number of products on WooCommerce
     * @param perpage
     * @private
     */
    async #getWooCommerceTotalProducts(perpage: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/?per_page=${perpage}`)
                .then((response) => {
                    resolve(response.headers['x-wp-total']);
                })
                .catch((error) => {
                    reject(error.response.data);
                });
        });
    }

    /**
     * getWooCommerceProducts - Function to extract all the existing products from WooCommerce
     */
    async getWooCommerceProducts(perpage: number, page: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/?per_page=${perpage}&page=${page}`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error.response.data);
                });
        });
    }

    /**
     * insertCategories - Funtion that will check the categories, if they already exist or not, and then insert isto WooCommerce
     * @param array
     * @private
     */
    async #insertCategories(categories: UniversalDataFormatCategories[]) {
        return new Promise(async (resolve, reject) => {
            let _errors = [];

            const multibar = new MultiBar({
                clearOnComplete: false,
                hideCursor: true,
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Inserting categories  |${BarColors.magenta('{bar}')}| {percentage}% | {value}/{total} {estado} | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            const singlebar = new SingleBar({
                clearOnComplete: false,
                hideCursor: true,
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Getting categories    |${BarColors.greenBright('{bar}')}| {percentage}% | {value}/{total} pages | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            const perpage = 100;
            const total_pages: number = parseInt(await this.#getWooCommerceTotalCategoriesPages(perpage));

            let _wcCategories: any = [];

            singlebar.start(this._pageWcConfig.totalCategoriesPages, 0);

            for (let i = 1; i <= total_pages; i++) {
                _wcCategories = _wcCategories.concat(await this.getWooCommerceCategories(perpage, i))
                singlebar.increment(1);
            }

            singlebar.stop()

            const sucess = multibar.create(categories.length, 0);
            sucess.update(0, {estado: `${BarColors.greenBright('Successfully')}`});
            const failed = multibar.create(categories.length, 0);
            failed.update(0, {estado: `${BarColors.redBright('Failed')}`});

            for (const element of categories) {
                const index = categories.indexOf(element);
                const exist: any = await this.#compareCategories(_wcCategories, categories[index])

                if (!exist.compare) {
                    //Create the new category
                    try {
                        let newID = await this.#insertCategoryIntoWooCommerce(categories[index])
                        //Creat an object to be sent into the list of categories to know the original ID
                        const res: categoryIndexArray = {
                            originalID: categories[index].id.toString(),
                            woocommerceID: newID.toString(),
                        }

                        //Insert the new category in the list of categories to know the original ID
                        this._allCategories.push(res)
                        sucess.increment(1)
                    } catch (e) {
                        const error = {
                            msg: e,
                            item: categories[index]
                        }

                        _errors = _errors.concat(error);

                        failed.increment(1)
                    }
                } else {
                    failed.increment(1)
                }
            }

            writeFile("debug/WooCommerce/log_categories.json", JSON.stringify(_errors), err => {
                if (err) {
                    console.error(err)
                }
            })

            multibar.stop();
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
            let display: string = "default"

            for (const element of this._allCategories) {
                if (element.originalID === array.parent.toString()) {
                    parent = element.woocommerceID
                    display = 'subcategories'
                }
            }

            const data = {
                name: array.name,
                parent: parent,
                display: display
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
     * insertItems - Funtion that will associate the category to the item and then insert isto WooCommerce
     * @param array
     * @private
     */
    async #insertItems(array: UniversalDataFormatItems[]) {
        return new Promise(async (resolve, reject) => {
            let _logItems = [];

            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Inserting items       |${BarColors.magenta('{bar}')}| {percentage}% | {value}/{total} | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            progressBar.start(array.length, 0);

            for (let i = 0; i < array.length; i++) {
                let newID: string = await this.#convertItemCategory(array[i])
                array[i].id_category = parseInt(newID);
                try {
                    await this.#insertItemIntoWooCommerce(array[i])
                    progressBar.increment(1)
                } catch (e) {
                    if (e.response.data.message === "REF inválida ou duplicada.") {
                        try {
                            await this.#updateItemOnWooCommerce(e.response.data.data.resource_id, array[i]);
                            const log = {
                                msg: "Product updated!",
                                error: e.response.data,
                                item: array[i]
                            }
                            _logItems = _logItems.concat(log);
                        } catch (errorLog) {
                            const log = {
                                msg: errorLog.response.data.message,
                                error: errorLog.response.data,
                                item: array[i]
                            }
                            _logItems = _logItems.concat(log);
                        }
                        progressBar.increment(1)
                    } else {
                        const error = {
                            msg: e.response.data.message,
                            error: e.response.data,
                            item: array[i]
                        }
                        _logItems = _logItems.concat(error);
                        reject(e)
                    }
                }
            }
            writeFile("debug/WooCommerce/log_items.json", JSON.stringify(_logItems), err => {
                if (err) {
                    console.error(err)
                }
            })
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
                manage_stock: true,
                stock_quantity: array.stock,
                stock_status: "instock",
                sku: array.id.toString(),
                images: [
                    {
                        src: array.image
                    }
                ]
            };

            this._WooCommerce.post("products", data)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error);
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

    async #updateItemOnWooCommerce(id: number, array: UniversalDataFormatItems): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const data = {
                name: array.description,
                regular_price: array.pvp_1.toString(),
                description: array.description_long,
                short_description: array.description_short,
                categories: [
                    {
                        id: array.id_category
                    },
                ],
                manage_stock: true,
                stock_quantity: array.stock,
                stock_status: "instock",
                images: [
                    {
                        src: array.image
                    }
                ]
            };
            this._WooCommerce.put(`products/${id}`, data)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * deleteAllCategories - Funtion that deletes every existing category on WooCommerce
     * @private
     */
    async #deleteAllCategories() {
        return new Promise(async (resolve, reject) => {
            let _wcCategories: any = [];

            //Declaring the progress bar for the number of pages with categories to know how many categories are left to get
            const categoriesPagesSingleBar = new SingleBar({
                clearOnComplete: false,
                hideCursor: true,
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Getting categories    |${BarColors.greenBright('{bar}')}| {percentage}% | {value}/{total} pages | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            //Starting the progress bar
            categoriesPagesSingleBar.start(this._pageWcConfig.totalCategoriesPages, 0);

            //Run a loop to get all the categories in each page
            for (let i = 1; i <= this._pageWcConfig.totalCategoriesPages; i++) {
                //Adding the categories in that page into the _wcCategories
                _wcCategories = _wcCategories.concat(await this.getWooCommerceCategories(this._pageWcConfig.perpage, i))
                //Incrementing the progress bar
                categoriesPagesSingleBar.increment(1)
            }

            //Stop the progress bar for the categories
            categoriesPagesSingleBar.stop();

            //Creating the progress bar to know how many categories remain to delete
            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Deleting categories   |${BarColors.redBright('{bar}')}| {percentage}% | {value}/{total} Categories | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            //Start the progress bar
            progressBar.start(this._pageWcConfig.totalCategories, 0);

            //Run a loop for each category
            for (let i = 0; i < this._pageWcConfig.totalCategories; i++) {
                try {
                    //Delete the category
                    await this.#deleteCategory(_wcCategories[i].id);
                    //Incrementing the progress bar regardless the response
                    progressBar.increment(1)
                } catch (e) {
                    progressBar.increment(1)
                    continue
                }
            }
            //Stoping the progress bar
            progressBar.stop();
            resolve(true)
        });
    }

    /**
     * deleteCategory - Function to delete an indicated (id) category on WooCommerce
     * @param id
     * @private
     */
    async #deleteCategory(id: number) {
        return new Promise((resolve, reject) => {
            this._WooCommerce.delete(`products/categories/${id}`, {
                force: true
            })
                .then((response) => {
                    resolve(true)
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

    async #deleteAllProducts() {
        return new Promise(async (resolve, reject) => {
            let _wcProducts: any = [];

            //Declaring the progress bar for the number of pages with products to know how many paroducts are left to get
            const productPagesSingleBar = new SingleBar({
                clearOnComplete: false,
                hideCursor: true,
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Getting Products      |${BarColors.greenBright('{bar}')}| {percentage}% | {value}/{total} pages | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            //Starting the progress bar
            productPagesSingleBar.start(this._pageWcConfig.totalProductsPages, 0);

            //Run a loop to get all the products in each page
            for (let i = 1; i <= this._pageWcConfig.totalProductsPages; i++) {
                //Adding the products in that page into the _wcProducts
                _wcProducts = _wcProducts.concat(await this.getWooCommerceProducts(this._pageWcConfig.perpage, i))
                //Incrementing the progress bar
                productPagesSingleBar.increment(1)
            }

            //Stop the progress bar for the products
            productPagesSingleBar.stop();

            //Creating the progress bar to know how many products remain to delete
            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Deleting Products     |${BarColors.redBright('{bar}')}| {percentage}% | {value}/{total} Items | ETA:{eta}s | {duration}s`
            }, Presets.shades_classic);

            //Start the progress bar
            progressBar.start(this._pageWcConfig.totalProducts, 0);

            //Run a loop for each product
            for (let i = 0; i < this._pageWcConfig.totalProducts; i++) {
                try {
                    //Delete the product
                    await this.#deleteProduct(_wcProducts[i].id);
                    //Incrementing the progress bar regardless the response
                    progressBar.increment(1)
                } catch (e) {
                    progressBar.increment(1)
                    continue
                }
            }
            //Stoping the progress bar
            progressBar.stop();
            resolve(true)
        });
    }

    async #deleteProduct(id: number) {
        return new Promise((resolve, reject) => {
            this._WooCommerce.delete(`products/${id}`, {
                force: true
            })
                .then((response) => {
                    resolve(true)
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

    async execute() {
        try {
            this._pageWcConfig.totalCategoriesPages = parseInt(await this.#getWooCommerceTotalCategoriesPages(this._pageWcConfig.perpage));
            this._pageWcConfig.totalCategories = parseInt(await this.#getWooCommerceTotalCategories(this._pageWcConfig.perpage));
            this._pageWcConfig.totalProductsPages = parseInt(await this.#getWooCommerceTotalProductsPages(this._pageWcConfig.perpage));
            this._pageWcConfig.totalProducts = parseInt(await this.#getWooCommerceTotalProducts(this._pageWcConfig.perpage));

            let categoriesInsert = await this.#insertCategories(this._universalDataFormat.categories);
            let itemsInsert = await this.#insertItems(this._universalDataFormat.items);

            console.log(categoriesInsert)
            console.log(itemsInsert)

            console.log(this._pageWcConfig)

            /*await this.#deleteAllProducts()
            await this.#deleteAllCategories()*/

        } catch (e) {
            console.log("\n", e);
        }
    }
}

export {WooCommerce}