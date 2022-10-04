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
var _Goldylocks_instances, _Goldylocks_getToken, _Goldylocks_getFamilies, _Goldylocks_getArticles, _Goldylocks_convertFamilies, _Goldylocks_convertArticles;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goldylocks = void 0;
const axios_1 = require("axios");
const cli_progress_1 = require("cli-progress");
const colors = require("ansi-colors");
class Goldylocks {
    constructor(config) {
        _Goldylocks_instances.add(this);
        this.credentials = new URLSearchParams();
        const { username, password } = config;
        this.credentials.append("username", username);
        this.credentials.append("password", password);
        this.goldyData = {
            articles: [],
            families: []
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    process.stdout.write(`${colors.greenBright("[Goldylocks]")} Obtaining Token... `);
                    axios_1.default.defaults.headers.common['Authorization'] = yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_getToken).call(this);
                    axios_1.default.defaults.withCredentials = true;
                    process.stdout.write(`${colors.greenBright("Done")}\n`);
                    process.stdout.write(`${colors.greenBright("[Goldylocks]")} Fetching families... `);
                    this.goldyData.families = yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_getFamilies).call(this);
                    process.stdout.write(`${colors.greenBright("Done")}\n`);
                    process.stdout.write(`${colors.greenBright("[Goldylocks]")} Fetching articles... `);
                    this.goldyData.articles = yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_getArticles).call(this);
                    process.stdout.write(`${colors.greenBright("Done")}\n`);
                    resolve({
                        categories: __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_convertFamilies).call(this),
                        items: __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_convertArticles).call(this)
                    });
                }
                catch (e) {
                    console.error(`${colors.greenBright("[Goldylocks]")} ${e}`);
                    reject(e);
                }
            }));
        });
    }
}
exports.Goldylocks = Goldylocks;
_Goldylocks_instances = new WeakSet(), _Goldylocks_getToken = function _Goldylocks_getToken() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.post("https://devssl.goldylocks.pt/gl/api/obtertoken", this.credentials);
            if (res.data.token)
                resolve(res.data.token);
            else
                reject("Error obtaining Goldylocks token");
        }));
    });
}, _Goldylocks_getFamilies = function _Goldylocks_getFamilies() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get("https://devssl.goldylocks.pt/gl/api/familias/");
            if (typeof res.data === "object" && res.data !== null)
                resolve(res.data);
            else
                reject("Error obtaining families");
        }));
    });
}, _Goldylocks_getArticles = function _Goldylocks_getArticles() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res = yield axios_1.default.get("https://devssl.goldylocks.pt/gl/api/numeroartigos");
            let nArtigos;
            if (res.data) {
                nArtigos = res.data;
            }
            else {
                reject("Error obtaining number of Goldylocks articles");
            }
            res = yield axios_1.default.get(`https://devssl.goldylocks.pt/gl/api/artigos/?l=${nArtigos}`);
            if (typeof res.data === "object" && res.data !== null)
                resolve(res.data);
            else
                reject("Error obtaining Goldylocks articles");
        }));
    });
}, _Goldylocks_convertFamilies = function _Goldylocks_convertFamilies() {
    const progressBar = new cli_progress_1.SingleBar({
        barsize: 25,
        format: `${colors.greenBright("[Goldylocks]")} Converting families... ${colors.greenBright("{bar}")} {value}/{total}`
    }, cli_progress_1.Presets.shades_classic);
    progressBar.start(this.goldyData.families.length, 0);
    let udfCategories = [];
    for (let i in this.goldyData.families) {
        udfCategories.push({
            id: this.goldyData.families[i].id_familia,
            name: this.goldyData.families[i].descricao,
            parent: this.goldyData.families[i].familia_pai
        });
        progressBar.increment(1);
    }
    progressBar.stop();
    return udfCategories;
}, _Goldylocks_convertArticles = function _Goldylocks_convertArticles() {
    const progressBar = new cli_progress_1.SingleBar({
        barsize: 25,
        format: `${colors.greenBright("[Goldylocks]")} Converting articles... ${colors.greenBright("{bar}")} {value}/{total}`
    }, cli_progress_1.Presets.shades_classic);
    progressBar.start(this.goldyData.articles.length, 0);
    let udfItems = [];
    for (let i in this.goldyData.articles) {
        udfItems.push({
            bar_code: this.goldyData.articles[i].cod_barras,
            brand: "",
            category: this.goldyData.articles[i].familia,
            description: this.goldyData.articles[i].nome,
            description_long: this.goldyData.articles[i].descricao_tecnica,
            description_short: this.goldyData.articles[i].nome,
            dimensions: { height: 0, width: 0 },
            id: this.goldyData.articles[i].cod_barras,
            id_category: this.goldyData.articles[i].id_familia,
            image: "",
            min_sell: 0,
            pvp_1: this.goldyData.articles[i].pvp,
            stock: this.goldyData.articles[i].stock_atual,
            weight: 0
        });
        progressBar.increment(1);
    }
    progressBar.stop();
    return udfItems;
};
//# sourceMappingURL=Goldylocks.js.map