import {ReadConfiguration} from "./Configuration";
import {Configuration} from "../interfaces/Configuration";

class Core {
    configuration: Configuration

    constructor(configPath: string) {
        /* read configuration */
        this.configuration = ReadConfiguration(configPath)
    }
}

export {
    Core,
}
