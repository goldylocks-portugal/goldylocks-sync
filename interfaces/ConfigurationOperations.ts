interface PluginConfiguration {
    plugin: string;
    configuration: any;
}

interface ConfigurationOperation {
    input: PluginConfiguration,
    output: PluginConfiguration,
}

export {
    PluginConfiguration,
    ConfigurationOperation,
}
