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

    async start() {
        this.configuration.operations.forEach(async (operation) => {
            await new Promise(async (resolve, reject) => {
                await this.processInput(operation.input)
            })
        })
    }

    async processOperation(operation: ConfigurationOperation) {

    }

    async processInput(pluginConfiguration: PluginConfiguration): Promise<UniversalDataFormat> {
        const plugin = await import(`../input-plugins/${pluginConfiguration.plugin}`)

        return {
            items: [],
            categories: [],
        }
    }

    async processOutput(pluginConfiguration: PluginConfiguration, data: UniversalDataFormat) {
        const plugin = await import(`../input-plugins/${pluginConfiguration.plugin}`)
    }
}

export {
    Core,
}
