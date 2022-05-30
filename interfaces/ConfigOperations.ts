interface PluginConfiguration {
    plugin: string;
    configuration: any;
}

interface ConfigOperation {
    input: PluginConfiguration,
    output: PluginConfiguration,
}

export {
    PluginConfiguration,
    ConfigOperation,
}
