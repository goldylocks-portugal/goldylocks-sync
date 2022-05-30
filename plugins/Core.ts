import {ReadConfiguration} from "./Configuration";
import {Configuration} from "../interfaces/Configuration";
import {ConfigurationOperation, PluginConfiguration} from "../interfaces/ConfigurationOperations";
import {UniversalDataFormat} from "../interfaces/UniversalDataFormat";

class Core {
    configuration: Configuration

    constructor(configPath: string) {
        /* read configuration */
        this.configuration = ReadConfiguration(configPath)
    }


    processOperation(operation: ConfigurationOperation) {

    }

    processInput(pluginConfiguration: PluginConfiguration): UniversalDataFormat {
        return {
            items: [],
            categories: [],
        }
    }

    processOutput(pluginConfiguration: PluginConfiguration, data: UniversalDataFormat) {

    }
}

export {
    Core,
}
