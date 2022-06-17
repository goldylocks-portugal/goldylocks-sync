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

    /**
     * execute operations
     */
    async start() {
        this.configuration.operations.forEach(async (operation) => {
            await new Promise(async (resolve, reject) => {
                await this.processOperation(operation)
            })
        })
    }

    /**
     * process each sync operation
     * @param operation
     */
    async processOperation(operation: ConfigurationOperation) {
        await this.processOutput(operation.output, await this.processInput(operation.input))
    }

    /**
     * get input data from plugin
     * @param pluginConfiguration
     */
    async processInput(pluginConfiguration: PluginConfiguration): Promise<UniversalDataFormat> {
        const Plugin = await import(`./../input-plugins/${pluginConfiguration.plugin}`)
        const plugin = new Plugin[pluginConfiguration.plugin](pluginConfiguration.configuration)

        return await plugin.execute()
    }

    /**
     * send data to output plugin and execute it
     * @param pluginConfiguration
     * @param data
     */
    async processOutput(pluginConfiguration: PluginConfiguration, data: UniversalDataFormat) {
        const Plugin = await import(`../output-plugins/${pluginConfiguration.plugin}`)
        const plugin = new Plugin[pluginConfiguration.plugin](pluginConfiguration.configuration, data)

        return await plugin.execute()
    }
}

export {
    Core,
}
