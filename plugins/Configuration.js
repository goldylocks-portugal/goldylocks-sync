"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadConfiguration = void 0;
var fs_1 = require("fs");
/**
 * read configuration file
 * @param path
 * @constructor
 */
var ReadConfiguration = function (path) {
    if (path === void 0) { path = 'config.json'; }
    return JSON.parse((0, fs_1.readFileSync)(path).toString());
};
exports.ReadConfiguration = ReadConfiguration;
