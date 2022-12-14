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
var _Altoinfor_instances, _Altoinfor_download, _Altoinfor_csvToJson, _Altoinfor_jsonToUniversalDataFormatItems, _Altoinfor_getCategoryIDPerItem, _Altoinfor_jsonToUniversalDataFormatCategories, _Altoinfor_compareCategories, _Altoinfor_addCategory, _Altoinfor_sheetLimitRange;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Altoinfor = void 0;
const https = require("https");
const fs_1 = require("fs");
const axios_1 = require("axios");
const BarColors = require("ansi-colors");
const cli_progress_1 = require("cli-progress");
const Path = require("path");
const XLSX = require("xlsx");
class Altoinfor {
    constructor(config) {
        _Altoinfor_instances.add(this);
        this.url = "";
        this.url = config.url + config.clientID;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // await this.#download().then(async () => {
                    let json = yield __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_csvToJson).call(this);
                    let categories = yield __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_jsonToUniversalDataFormatCategories).call(this, json);
                    //let items = await this.#jsonToUniversalDataFormatItems(json, categories);
                    let items = [{
                            "id_category": 3,
                            'bar_code': '3259920015251',
                            "brand": "DAMMANN FR??RES",
                            "category": "Acessorios",
                            "description": "Filtro de Ch?? Descart??vel para Bule 64un",
                            "description_short": "Filtro de Ch?? Descart??vel para Bule 64un",
                            "description_long": "Estes filtros universais para ch?? s??o adequados para todos os tipos de ch?? a granel. De sabor neutro, permitem a infus??o de ch??s de folhas ou ch??s de ervas. Resistente, o papel n??o se desfaz mesmo depois de muito tempo embebido em ??gua. Ideal para al pr??ara????o do infusor em bule, podendo ser utilizado tamb??m em x??cara alta.",
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
                            "brand": "DAMMANN FR??RES",
                            "category": "Acessorios",
                            "description": "Filtro de Ch?? Descart??vel para Bule 64un",
                            "description_short": "Filtro de Ch?? Descart??vel para Bule 64un",
                            "description_long": "Estes filtros universais para ch?? s??o adequados para todos os tipos de ch?? a granel. De sabor neutro, permitem a infus??o de ch??s de folhas ou ch??s de ervas. Resistente, o papel n??o se desfaz mesmo depois de muito tempo embebido em ??gua. Ideal para al pr??ara????o do infusor em bule, podendo ser utilizado tamb??m em x??cara alta.",
                            "id": '6591525',
                            "image": "http://www.netimagens.com/images/produtos/6591525.jpg",
                            "min_sell": 1,
                            "pvp_1": 4.45,
                            "pvp_2": 0,
                            "stock": 10,
                            "weight": 0.06
                        }];
                    let universalData = { categories: categories, items: items };
                    resolve(universalData);
                    // });
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
}
exports.Altoinfor = Altoinfor;
_Altoinfor_instances = new WeakSet(), _Altoinfor_download = function _Altoinfor_download() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let bytesDownloaded = 0;
            process.stdout.write(`${BarColors.cyan('[Altoinfor]')} Connecting... `);
            const array = yield axios_1.default.get(this.url, {
                responseEncoding: 'utf-8',
                responseType: 'stream',
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            });
            console.log(`${BarColors.cyan('Done')}`);
            let totalLength = array.headers['content-length'] ? array.headers['content-length'] : 1000;
            const progressBar = new cli_progress_1.SingleBar({
                barsize: 25,
                format: `${BarColors.cyan('[Altoinfor]')} Downloading CSV      |${BarColors.cyan('{bar}')}| | {percentage}% | {value}/{total} Chunks | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            progressBar.start(totalLength, 0);
            const writer = (0, fs_1.createWriteStream)(Path.resolve(__dirname + '/../downloads/', `temp.csv`));
            try {
                array.data.on('data', (chunk) => {
                    bytesDownloaded += chunk.length;
                    let multiplier = Math.floor(Math.random() * (6 - 1)) + 1;
                    if (totalLength < bytesDownloaded) {
                        totalLength = bytesDownloaded * multiplier;
                        progressBar.setTotal(bytesDownloaded * multiplier);
                    }
                    progressBar.increment(chunk.length);
                });
                array.data.on('end', () => {
                    progressBar.setTotal(bytesDownloaded);
                    progressBar.stop();
                    resolve(true);
                });
                array.data.pipe(writer);
            }
            catch (e) {
                reject(e);
            }
        }));
    });
}, _Altoinfor_csvToJson = function _Altoinfor_csvToJson() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            process.stdout.write(`${BarColors.cyan('[Altoinfor]')} Converting csv into JSON... `);
            let workbook = XLSX.readFile(`${__dirname}/../downloads/temp.csv`);
            console.log(`${BarColors.cyan('Done')}`);
            resolve(workbook);
        });
    });
}, _Altoinfor_jsonToUniversalDataFormatItems = function _Altoinfor_jsonToUniversalDataFormatItems(data, categories) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const progressBar = new cli_progress_1.SingleBar({
                barsize: 25,
                format: `${BarColors.cyan('[Altoinfor]')} Getting items        |${BarColors.cyan('{bar}')}| {percentage}% | {value}/{total} | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            for (let i in data.Sheets) {
                let range = __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_sheetLimitRange).call(this, data.Sheets[i]);
                progressBar.start(range, 0);
                let products = [];
                //linhas
                for (let j = 1; j <= range; j++) {
                    let family_id = yield __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_getCategoryIDPerItem).call(this, categories, data.Sheets[i], j);
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
                    });
                    progressBar.increment(1);
                }
                products.shift();
                progressBar.stop();
                process.stdout.write(`${BarColors.cyan('[Altoinfor]')} Saving debug file for products... `);
                (0, fs_1.writeFile)("debug/Altoinfor/products.json", JSON.stringify(products), err => {
                    if (err) {
                        console.error(err);
                    }
                });
                console.log(`${BarColors.cyan('Done')}`);
                resolve(products);
            }
        }));
    });
}, _Altoinfor_getCategoryIDPerItem = function _Altoinfor_getCategoryIDPerItem(categories, item, index) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let temp = { id: 0, name: "", parent: 0 };
            let categoriesForItems = [];
            let id = 1;
            let parent = 0;
            const tempCategories = yield __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_addCategory).call(this, categoriesForItems, parent, id, item, index);
            temp = tempCategories.categories;
            for (let i in categories) {
                if (categories[i].parent === 0 && categories[i].name === temp[0].name) {
                    temp[0].id = categories[i].id;
                    temp[1].parent = categories[i].id;
                    const child = categories.filter((obj) => {
                        return obj.parent === temp[1].parent && obj.name === temp[1].name;
                    });
                    temp[2].parent = child[0].id;
                    temp[1].id = child[0].id;
                    const grandChild = categories.filter((obj) => {
                        return obj.parent === temp[2].parent && obj.name === temp[2].name;
                    });
                    temp[2].id = grandChild[0].id;
                }
            }
            resolve(temp[2].id);
        }));
    });
}, _Altoinfor_jsonToUniversalDataFormatCategories = function _Altoinfor_jsonToUniversalDataFormatCategories(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const progressBar = new cli_progress_1.SingleBar({
                barsize: 25,
                format: `${BarColors.cyan('[Altoinfor]')} Getting categories   |${BarColors.cyan('{bar}')}| {percentage}% | {value}/{total} | ETA:{eta}s | {duration}s`
            }, cli_progress_1.Presets.shades_classic);
            for (let i in data.Sheets) {
                let range = __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_sheetLimitRange).call(this, data.Sheets[i]);
                //Removes 1 from range because, the first 2 lines on the CSV are a blank line and the header,
                // in the previous function we remove the blank one, and now we need to say to the progress bar that we need to remove one more (the header one)
                progressBar.start(range - 1, 0);
                let categories = [];
                let id = 1;
                let parent = 0;
                //linhas
                //It starts on 2 because the first 2 lines on the CSV are a blank line and the header
                for (let j = 2; j <= range; j++) {
                    try {
                        const insertCategories = yield __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_addCategory).call(this, categories, parent, id, data.Sheets[i], j);
                        id = insertCategories.newid;
                        categories = insertCategories.categories;
                        progressBar.increment(1);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                progressBar.stop();
                process.stdout.write(`${BarColors.cyan('[Altoinfor]')} Saving debug file for categories... `);
                (0, fs_1.writeFile)("debug/Altoinfor/categories.json", JSON.stringify(categories), err => {
                    if (err) {
                        console.error(err);
                    }
                });
                console.log(`${BarColors.cyan('Done')}`);
                resolve(categories);
            }
        }));
    });
}, _Altoinfor_compareCategories = function _Altoinfor_compareCategories(categories, newCategory) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let compare = false;
            let parent = 0;
            //checks if the categories array is empty or not
            if (categories.length !== 0) {
                //If not empty, loops
                for (let i in categories) {
                    if (categories[i].parent === newCategory.parent) {
                        compare = categories[i].name === newCategory.name;
                        parent = categories[i].id;
                    }
                }
            }
            resolve({ "compare": compare, "parent": parent });
        });
    });
}, _Altoinfor_addCategory = function _Altoinfor_addCategory(categories, parent, id, data, index) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let temp = { id: 0, name: "", parent: 0 };
            let exists = 0;
            let name = '';
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
            };
            exists = yield __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_compareCategories).call(this, categories, temp);
            if (!exists.compare) {
                categories.push({
                    id: id,
                    name: temp.name,
                    parent: 0
                });
                parent = id;
                id++;
            }
            else {
                parent = exists.parent;
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
            };
            exists = yield __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_compareCategories).call(this, categories, temp);
            if (!exists.compare) {
                categories.push({
                    id: id,
                    name: temp.name,
                    parent: parent
                });
                parent = id;
                id++;
            }
            else {
                parent = exists.parent;
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
            };
            //exists = await this.#compareCategories(categories, temp)
            let filterGrandChildren = categories.filter(function (el) {
                return (el.name === temp.name && temp.parent === el.parent);
            });
            if (filterGrandChildren.length === 0) {
                if (temp.name === 'Hp Original') {
                    console.log('temp', temp);
                    console.log(filterGrandChildren);
                    debugger;
                }
                categories.push({
                    id: id,
                    name: temp.name,
                    parent: parent
                });
                parent = id;
                id++;
            }
            else {
                exists = yield __classPrivateFieldGet(this, _Altoinfor_instances, "m", _Altoinfor_compareCategories).call(this, categories, temp);
                parent = exists.parent;
            }
            resolve({ categories: categories, newid: id });
        }));
    });
}, _Altoinfor_sheetLimitRange = function _Altoinfor_sheetLimitRange(data) {
    //Check the range limit off the sheet (start and end like A1:V15)
    const arrayDivided = data['!ref'].split(":");
    let range = {
        totalLines: 0
    };
    Object.keys(arrayDivided).forEach((value, index, array) => {
        let match = arrayDivided[value].match(/[a-zA-Z]+|[0-9]+/g);
        range.totalLines = match[1];
    });
    return range.totalLines;
};
//# sourceMappingURL=Altoinfor.js.map