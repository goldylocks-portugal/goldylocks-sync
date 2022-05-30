"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Core_1 = require("./plugins/Core");
/* instantiate core plugin */
var core = new Core_1.Core('config.json');
core.start();
