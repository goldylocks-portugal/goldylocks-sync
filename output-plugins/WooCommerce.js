"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WooCommerce_instances, _WooCommerce_getWooCommerceTotalCategoriesPages, _WooCommerce_getWooCommerceTotalCategories, _WooCommerce_getWooCommerceTotalProductsPages, _WooCommerce_getWooCommerceTotalProducts, _WooCommerce_insertCategories, _WooCommerce_compareCategories, _WooCommerce_insertCategoryIntoWooCommerce, _WooCommerce_insertItems, _WooCommerce_insertItemIntoWooCommerce, _WooCommerce_convertItemCategory, _WooCommerce_updateItemOnWooCommerce, _WooCommerce_deleteAllCategories, _WooCommerce_deleteCategory, _WooCommerce_deleteAllProducts, _WooCommerce_deleteProduct;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WooCommerce = void 0;
const fs_1 = require("fs");
const BarColors = require("ansi-colors");
const cli_progress_1 = require("cli-progress");
const woocommerce_rest_api_1 = require("@woocommerce/woocommerce-rest-api");
class WooCommerce {
    constructor(config, data) {
        _WooCommerce_instances.add(this);
        this._WooCommerce = {};
        this._allCategories = [{
                originalID: "0", woocommerceID: "0"
            }];
        this._pageWcConfig = {
            totalProducts: 0,
            totalProductsPages: 0,
            perpage: 100,
            totalCategoriesPages: 0,
            totalCategories: 0
        };
        process.stdout.write(`${BarColors.magenta('[WooCommerce]')} Connecting... `);
        this._WooCommerce = new woocommerce_rest_api_1.default({
            url: config.url,
            consumerKey: config.consumerKey,
            consumerSecret: config.consumerSecret,
            version: config.version
        });
        this._universalDataFormat = data;
        console.log(`${BarColors.magenta('Done')}`);
    }
    /**
     * getWooCommerceCategories - Function to extract all the existing categories from WooCommerce
     */
    getWooCommerceCategories(perpage, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._WooCommerce.get(`products/categories/?per_page=${perpage}&page=${page}`)
                    .then((response) => {
                    resolve(response.data);
                })
                    .catch((error) => {
                    reject(error.response.data);
                });
            });
        });
    }
    /**
     * getWooCommerceProducts - Function to extract all the existing products from WooCommerce
     */
    getWooCommerceProducts(perpage, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._WooCommerce.get(`products/?per_page=${perpage}&page=${page}`)
                    .then((response) => {
                    resolve(response.data);
                })
                    .catch((error) => {
                    reject(error.response.data);
                });
            });
        });
    }
    ;
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._pageWcConfig.totalCategoriesPages = parseInt(yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_getWooCommerceTotalCategoriesPages).call(this, this._pageWcConfig.perpage));
                this._pageWcConfig.totalCategories = parseInt(yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_getWooCommerceTotalCategories).call(this, this._pageWcConfig.perpage));
                this._pageWcConfig.totalProductsPages = parseInt(yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_getWooCommerceTotalProductsPages).call(this, this._pageWcConfig.perpage));
                this._pageWcConfig.totalProducts = parseInt(yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_getWooCommerceTotalProducts).call(this, this._pageWcConfig.perpage));
                let categoriesInsert = yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_insertCategories).call(this, this._universalDataFormat.categories);
                let itemsInsert = yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_insertItems).call(this, this._universalDataFormat.items);
                console.log(categoriesInsert);
                console.log(itemsInsert);
                console.log(this._pageWcConfig);
                /*await this.#deleteAllProducts()
                await this.#deleteAllCategories()*/
            }
            catch (e) {
                console.log("\n", e);
            }
        });
    }
}
exports.WooCommerce = WooCommerce;
_WooCommerce_instances = new WeakSet(), _WooCommerce_getWooCommerceTotalCategoriesPages = function _WooCommerce_getWooCommerceTotalCategoriesPages(perpage) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/categories/?per_page=${perpage}`)
                .then((response) => {
                resolve(response.headers['x-wp-totalpages']);
            })
                .catch((error) => {
                reject(error.response.data);
            });
        });
    });
}, _WooCommerce_getWooCommerceTotalCategories = function _WooCommerce_getWooCommerceTotalCategories(perpage) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/categories/?per_page=${perpage}`)
                .then((response) => {
                resolve(response.headers['x-wp-total']);
            })
                .catch((error) => {
                reject(error.response.data);
            });
        });
    });
}, _WooCommerce_getWooCommerceTotalProductsPages = function _WooCommerce_getWooCommerceTotalProductsPages(perpage) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/?per_page=${perpage}`)
                .then((response) => {
                resolve(response.headers['x-wp-totalpages']);
            })
                .catch((error) => {
                reject(error.response.data);
            });
        });
    });
}, _WooCommerce_getWooCommerceTotalProducts = function _WooCommerce_getWooCommerceTotalProducts(perpage) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            this._WooCommerce.get(`products/?per_page=${perpage}`)
                .then((response) => {
                resolve(response.headers['x-wp-total']);
            })
                .catch((error) => {
                reject(error.response.data);
            });
        });
    });
}, _WooCommerce_insertCategories = function _WooCommerce_insertCategories(categories) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let _errors = [];
            const multibar = new cli_progress_1.MultiBar({
                clearOnComplete: false,
                hideCursor: true,
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Inserting categories  |${BarColors.magenta('{bar}')}| {percentage}% | {value}/{total} {estado} | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            const singlebar = new cli_progress_1.SingleBar({
                clearOnComplete: false,
                hideCursor: true,
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Getting categories    |${BarColors.greenBright('{bar}')}| {percentage}% | {value}/{total} pages | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            const perpage = 100;
            const total_pages = parseInt(yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_getWooCommerceTotalCategoriesPages).call(this, perpage));
            let _wcCategories = [];
            singlebar.start(this._pageWcConfig.totalCategoriesPages, 0);
            for (let i = 1; i <= total_pages; i++) {
                _wcCategories = _wcCategories.concat(yield this.getWooCommerceCategories(perpage, i));
                singlebar.increment(1);
            }
            singlebar.stop();
            const sucess = multibar.create(categories.length, 0);
            sucess.update(0, { estado: `${BarColors.greenBright('Successfully')}` });
            const failed = multibar.create(categories.length, 0);
            failed.update(0, { estado: `${BarColors.redBright('Failed')}` });
            for (const element of categories) {
                const index = categories.indexOf(element);
                const exist = yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_compareCategories).call(this, _wcCategories, categories[index]);
                if (!exist.compare) {
                    //Create the new category
                    try {
                        let newID = yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_insertCategoryIntoWooCommerce).call(this, categories[index]);
                        //Creat an object to be sent into the list of categories to know the original ID
                        const res = {
                            originalID: categories[index].id.toString(),
                            woocommerceID: newID.toString(),
                        };
                        //Insert the new category in the list of categories to know the original ID
                        this._allCategories.push(res);
                        sucess.increment(1);
                    }
                    catch (e) {
                        const error = {
                            msg: e,
                            item: categories[index]
                        };
                        _errors = _errors.concat(error);
                        failed.increment(1);
                    }
                }
                else {
                    failed.increment(1);
                }
            }
            (0, fs_1.writeFile)("debug/WooCommerce/log_categories.json", JSON.stringify(_errors), err => {
                if (err) {
                    console.error(err);
                }
            });
            multibar.stop();
            resolve(true);
        }));
    });
}, _WooCommerce_compareCategories = function _WooCommerce_compareCategories(array, category) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let compare = false;
            let parent = 0;
            for (let element of array) {
                let i = array.indexOf(element);
                if (category.parent === 0) {
                    if (array[i].parent === 0) {
                        compare = (array[i].name == category.name);
                        if (compare) {
                            this._allCategories.push({ originalID: category.id, woocommerceID: array[i].id });
                            break;
                        }
                    }
                    else {
                        let temp = [...this._allCategories];
                        for (const element of temp) {
                            const index = temp.indexOf(element);
                            if (temp[index].originalID == category.parent) {
                                if (array[i].parent == temp[index].woocommerceID) {
                                    compare = (array[i].name == category.name);
                                    if (compare) {
                                        this._allCategories.push({ originalID: category.id, woocommerceID: array[i].id });
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    let temp = [...this._allCategories];
                    for (const element of temp) {
                        const index = temp.indexOf(element);
                        if (temp[index].originalID == category.parent) {
                            if (array[i].parent == temp[index].woocommerceID) {
                                compare = (array[i].name == category.name);
                                if (compare) {
                                    this._allCategories.push({ originalID: category.id, woocommerceID: array[i].id });
                                    break;
                                }
                            }
                        }
                    }
                }
                if (compare) {
                    break;
                }
            }
            if (compare) {
                resolve({ "compare": compare, "parent": parent, "nome": category.name });
            }
            else {
                resolve({ "compare": compare, "parent": parent, "nome": category.name });
            }
        });
    });
}, _WooCommerce_insertCategoryIntoWooCommerce = function _WooCommerce_insertCategoryIntoWooCommerce(array) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(((resolve, reject) => {
            let parent = "0";
            let display = "default";
            for (const element of this._allCategories) {
                if (element.originalID === array.parent.toString()) {
                    parent = element.woocommerceID;
                    display = 'subcategories';
                }
            }
            const data = {
                name: array.name,
                parent: parent,
                display: display
            };
            this._WooCommerce.post("products/categories", data)
                .then((response) => {
                resolve(response.data.id);
            })
                .catch((error) => {
                reject(error);
            });
        }));
    });
}, _WooCommerce_insertItems = function _WooCommerce_insertItems(array) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let _logItems = [];
            const progressBar = new cli_progress_1.SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Inserting items       |${BarColors.magenta('{bar}')}| {percentage}% | {value}/{total} | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            progressBar.start(array.length, 0);
            for (let i = 0; i < array.length; i++) {
                let newID = yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_convertItemCategory).call(this, array[i]);
                array[i].id_category = parseInt(newID);
                try {
                    yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_insertItemIntoWooCommerce).call(this, array[i]);
                    progressBar.increment(1);
                }
                catch (e) {
                    if (e.response.data.message === "REF inválida ou duplicada.") {
                        try {
                            yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_updateItemOnWooCommerce).call(this, e.response.data.data.resource_id, array[i]);
                            const log = {
                                msg: "Product updated!",
                                error: e.response.data,
                                item: array[i]
                            };
                            _logItems = _logItems.concat(log);
                        }
                        catch (errorLog) {
                            const log = {
                                msg: errorLog.response.data.message,
                                error: errorLog.response.data,
                                item: array[i]
                            };
                            _logItems = _logItems.concat(log);
                        }
                        progressBar.increment(1);
                    }
                    else {
                        const error = {
                            msg: e.response.data.message,
                            error: e.response.data,
                            item: array[i]
                        };
                        _logItems = _logItems.concat(error);
                        reject(e);
                    }
                }
            }
            (0, fs_1.writeFile)("debug/WooCommerce/log_items.json", JSON.stringify(_logItems), err => {
                if (err) {
                    console.error(err);
                }
            });
            resolve(true);
            progressBar.stop();
        }));
    });
}, _WooCommerce_insertItemIntoWooCommerce = function _WooCommerce_insertItemIntoWooCommerce(array) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
                resolve(response);
            })
                .catch((error) => {
                reject(error);
            });
        })));
    });
}, _WooCommerce_convertItemCategory = function _WooCommerce_convertItemCategory(item) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let newID = "0";
            for (const element of this._allCategories) {
                const index = this._allCategories.indexOf(element);
                if (parseInt(this._allCategories[index].originalID) === item.id_category) {
                    newID = this._allCategories[index].woocommerceID;
                    break;
                }
            }
            resolve(newID);
        });
    });
}, _WooCommerce_updateItemOnWooCommerce = function _WooCommerce_updateItemOnWooCommerce(id, array) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}, _WooCommerce_deleteAllCategories = function _WooCommerce_deleteAllCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let _wcCategories = [];
            //Declaring the progress bar for the number of pages with categories to know how many categories are left to get
            const categoriesPagesSingleBar = new cli_progress_1.SingleBar({
                clearOnComplete: false,
                hideCursor: true,
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Getting categories    |${BarColors.greenBright('{bar}')}| {percentage}% | {value}/{total} pages | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            //Starting the progress bar
            categoriesPagesSingleBar.start(this._pageWcConfig.totalCategoriesPages, 0);
            //Run a loop to get all the categories in each page
            for (let i = 1; i <= this._pageWcConfig.totalCategoriesPages; i++) {
                //Adding the categories in that page into the _wcCategories
                _wcCategories = _wcCategories.concat(yield this.getWooCommerceCategories(this._pageWcConfig.perpage, i));
                //Incrementing the progress bar
                categoriesPagesSingleBar.increment(1);
            }
            //Stop the progress bar for the categories
            categoriesPagesSingleBar.stop();
            //Creating the progress bar to know how many categories remain to delete
            const progressBar = new cli_progress_1.SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Deleting categories   |${BarColors.redBright('{bar}')}| {percentage}% | {value}/{total} Categories | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            //Start the progress bar
            progressBar.start(this._pageWcConfig.totalCategories, 0);
            //Run a loop for each category
            for (let i = 0; i < this._pageWcConfig.totalCategories; i++) {
                try {
                    //Delete the category
                    yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_deleteCategory).call(this, _wcCategories[i].id);
                    //Incrementing the progress bar regardless the response
                    progressBar.increment(1);
                }
                catch (e) {
                    progressBar.increment(1);
                    continue;
                }
            }
            //Stoping the progress bar
            progressBar.stop();
            resolve(true);
        }));
    });
}, _WooCommerce_deleteCategory = function _WooCommerce_deleteCategory(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            this._WooCommerce.delete(`products/categories/${id}`, {
                force: true
            })
                .then((response) => {
                resolve(true);
            })
                .catch((error) => {
                reject(error);
            });
        });
    });
}, _WooCommerce_deleteAllProducts = function _WooCommerce_deleteAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let _wcProducts = [];
            //Declaring the progress bar for the number of pages with products to know how many paroducts are left to get
            const productPagesSingleBar = new cli_progress_1.SingleBar({
                clearOnComplete: false,
                hideCursor: true,
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Getting Products      |${BarColors.greenBright('{bar}')}| {percentage}% | {value}/{total} pages | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            //Starting the progress bar
            productPagesSingleBar.start(this._pageWcConfig.totalProductsPages, 0);
            //Run a loop to get all the products in each page
            for (let i = 1; i <= this._pageWcConfig.totalProductsPages; i++) {
                //Adding the products in that page into the _wcProducts
                _wcProducts = _wcProducts.concat(yield this.getWooCommerceProducts(this._pageWcConfig.perpage, i));
                //Incrementing the progress bar
                productPagesSingleBar.increment(1);
            }
            //Stop the progress bar for the products
            productPagesSingleBar.stop();
            //Creating the progress bar to know how many products remain to delete
            const progressBar = new cli_progress_1.SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Deleting Products     |${BarColors.redBright('{bar}')}| {percentage}% | {value}/{total} Items | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            //Start the progress bar
            progressBar.start(this._pageWcConfig.totalProducts, 0);
            //Run a loop for each product
            for (let i = 0; i < this._pageWcConfig.totalProducts; i++) {
                try {
                    //Delete the product
                    yield __classPrivateFieldGet(this, _WooCommerce_instances, "m", _WooCommerce_deleteProduct).call(this, _wcProducts[i].id);
                    //Incrementing the progress bar regardless the response
                    progressBar.increment(1);
                }
                catch (e) {
                    progressBar.increment(1);
                    continue;
                }
            }
            //Stoping the progress bar
            progressBar.stop();
            resolve(true);
        }));
    });
}, _WooCommerce_deleteProduct = function _WooCommerce_deleteProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            this._WooCommerce.delete(`products/${id}`, {
                force: true
            })
                .then((response) => {
                resolve(true);
            })
                .catch((error) => {
                reject(error);
            });
        });
    });
};
//# sourceMappingURL=WooCommerce.js.map