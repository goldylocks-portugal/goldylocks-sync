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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const Configuration_1 = require("./Configuration");
class Core {
    constructor(configPath) {
        /* read configuration */
        this.configuration = (0, Configuration_1.ReadConfiguration)(configPath);
    }
    /**
     * execute operations
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.configuration.operations.forEach((operation) => __awaiter(this, void 0, void 0, function* () {
                yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    yield this.processOperation(operation);
                }));
            }));
        });
    }
    /**
     * process each sync operation
     * @param operation
     */
    processOperation(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.processOutput(operation.output, yield this.processInput(operation.input));
        });
    }
    /**
     * get input data from plugin
     * @param pluginConfiguration
     */
    processInput(pluginConfiguration) {
        return __awaiter(this, void 0, void 0, function* () {
            const Plugin = yield Promise.resolve().then(() => require(`./../input-plugins/${pluginConfiguration.plugin}`));
            const plugin = new Plugin[pluginConfiguration.plugin](pluginConfiguration.configuration);
            return yield plugin.execute();
        });
    }
    /**
     * send data to output plugin and execute it
     * @param pluginConfiguration
     * @param data
     */
    processOutput(pluginConfiguration, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const Plugin = yield Promise.resolve().then(() => require(`../output-plugins/${pluginConfiguration.plugin}`));
            const plugin = new Plugin[pluginConfiguration.plugin](pluginConfiguration.configuration);
            return yield plugin.execute();
        });
    }
}
exports.Core = Core;
//# sourceMappingURL=Core.js.map