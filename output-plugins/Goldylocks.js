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
var _Goldylocks_instances, _Goldylocks_getToken, _Goldylocks_getFamilies, _Goldylocks_getArticles, _Goldylocks_createFamily, _Goldylocks_createOrEditArticle, _Goldylocks_convertToGoldylocks, _Goldylocks_parseFamilies, _Goldylocks_parseFamilyWithParent, _Goldylocks_parseArticles;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goldylocks = void 0;
const axios_1 = require("axios");
const cli_progress_1 = require("cli-progress");
const colors = require("ansi-colors");
class Goldylocks {
    constructor(config, data) {
        _Goldylocks_instances.add(this);
        this.credentials = new URLSearchParams();
        this.idIndex = [];
        const { username, password } = config;
        this.credentials.append("username", username);
        this.credentials.append("password", password);
        this.data = data;
        this.goldyData = {
            articles: [],
            families: []
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                process.stdout.write(`${colors.greenBright("[Goldylocks]")} Obtaining Token... `);
                axios_1.default.defaults.headers.common['Authorization'] = yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_getToken).call(this);
                axios_1.default.defaults.withCredentials = true;
                process.stdout.write(`${colors.greenBright("Done")}\n`);
                process.stdout.write(`${colors.greenBright("[Goldylocks]")} Fetching families... `);
                this.goldyData.families = yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_getFamilies).call(this);
                process.stdout.write(`${colors.greenBright("Done")}\n`);
                yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_parseFamilies).call(this);
                process.stdout.write(`${colors.greenBright("[Goldylocks]")} Fetching articles... `);
                this.goldyData.articles = yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_getArticles).call(this);
                process.stdout.write(`${colors.greenBright("Done")}\n`);
                yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_parseArticles).call(this);
            }
            catch (e) {
                console.error(`${colors.greenBright("[Goldylocks]")} ${e}`);
            }
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
}, _Goldylocks_createFamily = function _Goldylocks_createFamily(_family) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post("https://devssl.goldylocks.pt/gl/api/inserirfamilia/", null, {
                    params: {
                        p: _family.parent,
                        d: _family.name
                    }
                });
                if (res.data) {
                    this.idIndex.push({
                        udfID: _family.id,
                        goldyID: res.data
                    });
                    resolve();
                }
                else {
                    reject();
                }
            }
            catch (e) {
                reject(e);
            }
        }));
    });
}, _Goldylocks_createOrEditArticle = function _Goldylocks_createOrEditArticle(_article) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post("https://devssl.goldylocks.pt/gl/api/guardarartigo/", _article);
                if (res.data == "ok")
                    resolve();
                else
                    reject("Erro ao guardar artigo");
            }
            catch (e) {
                debugger;
                reject(e);
            }
        }));
    });
}, _Goldylocks_convertToGoldylocks = function _Goldylocks_convertToGoldylocks(_item) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let form = new URLSearchParams();
    form.append("cod_barras", (_a = _item.bar_code) !== null && _a !== void 0 ? _a : "");
    form.append("nome", (_b = _item.description) !== null && _b !== void 0 ? _b : "");
    form.append("familia", (_c = _item.id_category) !== null && _c !== void 0 ? _c : "");
    form.append("preco_custo", (_d = _item.pvp_1) !== null && _d !== void 0 ? _d : "");
    form.append("desconto_fornecedor", "");
    form.append("custo_final", "");
    form.append("imposto", "");
    form.append("tipo", "");
    form.append("margem1", "");
    form.append("margem2", "");
    form.append("margem3", "");
    form.append("psi1", "");
    form.append("psi2", "");
    form.append("psi3", "");
    form.append("pci1", "");
    form.append("pci2", "");
    form.append("pci3", "");
    form.append("cotacao_atual", "");
    form.append("descricao_tecnica", (_e = _item.description_long) !== null && _e !== void 0 ? _e : "");
    form.append("estado", "");
    form.append("bloquear_descontos", "");
    form.append("disponivel_webstore", "0"); // Required
    form.append("posicao", "");
    form.append("peso", (_f = _item.weight) !== null && _f !== void 0 ? _f : "");
    form.append("comprimento", "");
    form.append("largura", _item.dimensions ? ((_g = _item.dimensions.width) !== null && _g !== void 0 ? _g : "") : "");
    form.append("altura", _item.dimensions ? ((_h = _item.dimensions.height) !== null && _h !== void 0 ? _h : "") : "");
    form.append("unidade", "");
    form.append("lembrete", "");
    form.append("stock_minimo", "0"); // Required
    form.append("segunda_unidade", "");
    form.append("racio_segunda_unidade", "");
    form.append("autorizacao_venda", "");
    form.append("movimenta_stock", "1"); // Required
    form.append("id_artigo_anterior", "");
    form.append("webstore_tempo_entrega", "");
    form.append("processamento_lotes", "");
    form.append("tipo_artigo_composto", "");
    form.append("quantidade_automatica_stubs", "");
    form.append("plano_producao", "0"); // Required
    return form;
}, _Goldylocks_parseFamilies = function _Goldylocks_parseFamilies() {
    return __awaiter(this, void 0, void 0, function* () {
        const progressBar = new cli_progress_1.SingleBar({
            barsize: 25,
            format: `${colors.greenBright("[Goldylocks]")} Parsing families... ${colors.greenBright("{bar}")} {value}/{total}`
        }, cli_progress_1.Presets.shades_classic);
        progressBar.start(this.data.categories.length, 0);
        const familiesWithoutParent = this.data.categories.filter(e => e.parent == 0);
        for (let i in familiesWithoutParent) {
            const familyExistsInGoldy = this.goldyData.families.find(e => (e.familia_pai == 0) && (e.descricao == familiesWithoutParent[i].name));
            if (familyExistsInGoldy) {
                this.idIndex.push({
                    udfID: familiesWithoutParent[i].id,
                    goldyID: familyExistsInGoldy.id_familia
                });
            }
            else {
                yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_createFamily).call(this, familiesWithoutParent[i]);
            }
            const familiesWithThisParent = this.data.categories.filter(e => e.parent == familiesWithoutParent[i].id);
            for (let i in familiesWithThisParent) {
                familiesWithThisParent[i].parent = this.idIndex.find(e => e.udfID == familiesWithThisParent[i].parent).goldyID;
                yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_parseFamilyWithParent).call(this, familiesWithThisParent[i], progressBar);
                progressBar.increment(1);
            }
            progressBar.increment(1);
        }
        progressBar.stop();
    });
}, _Goldylocks_parseFamilyWithParent = function _Goldylocks_parseFamilyWithParent(_family, _progressBar) {
    return __awaiter(this, void 0, void 0, function* () {
        const familyExistsInGoldy = this.goldyData.families.find(e => (e.familia_pai == _family.parent) && (e.descricao == _family.name));
        if (familyExistsInGoldy) {
            this.idIndex.push({
                udfID: _family.id,
                goldyID: familyExistsInGoldy.id_familia
            });
        }
        else {
            yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_createFamily).call(this, _family);
        }
        const familiesWithThisParent = this.data.categories.filter(e => e.parent == _family.id);
        for (let i in familiesWithThisParent) {
            familiesWithThisParent[i].parent = this.idIndex.find(e => e.udfID == familiesWithThisParent[i].parent).goldyID;
            yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_parseFamilyWithParent).call(this, familiesWithThisParent[i], _progressBar);
            _progressBar.increment(1);
        }
    });
}, _Goldylocks_parseArticles = function _Goldylocks_parseArticles() {
    return __awaiter(this, void 0, void 0, function* () {
        const progressBar = new cli_progress_1.SingleBar({
            barsize: 25,
            format: `${colors.greenBright("[Goldylocks]")} Parsing articles... ${colors.greenBright("{bar}")} {value}/{total}`
        }, cli_progress_1.Presets.shades_classic);
        progressBar.start(this.data.items.length, 0);
        for (let i in this.data.items) {
            this.data.items[i].id_category = this.idIndex.find(e => e.udfID == this.data.items[i].id_category).goldyID;
            let goldyArticle = __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_convertToGoldylocks).call(this, this.data.items[i]);
            yield __classPrivateFieldGet(this, _Goldylocks_instances, "m", _Goldylocks_createOrEditArticle).call(this, goldyArticle);
            progressBar.increment(1);
        }
        progressBar.stop();
    });
};
//# sourceMappingURL=Goldylocks.js.map