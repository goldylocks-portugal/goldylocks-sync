"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadConfiguration = void 0;
const fs_1 = require("fs");
/**
 * read configuration file
 * @param path
 * @constructor
 */
const ReadConfiguration = (path = 'config.json') => {
    return JSON.parse((0, fs_1.readFileSync)(path).toString());
};
exports.ReadConfiguration = ReadConfiguration;
//# sourceMappingURL=Configuration.js.map