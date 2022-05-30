import {Configuration} from "../interfaces/Configuration";
import {readFileSync} from "fs";

/**
 * read configuration file
 * @param path
 * @constructor
 */
const ReadConfiguration = (path: string): Configuration => {
    return JSON.parse(readFileSync(path).toString())
}

export {
    ReadConfiguration,
}
