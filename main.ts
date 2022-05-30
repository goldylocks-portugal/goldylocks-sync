import {UniversalDataFormat} from "./interfaces/UniversalDataFormat";

const config = require('./config.json')

let inputs = [];
let outputs = [];

config.forEach(async (currentValue, index, array) => {

    console.log('CONFIG')
    console.log(config)


    let inputPlugin = currentValue['input']['plugin'];
    let outputPlugin = currentValue['output']['plugin'];

    try {
        console.log('index - ', index)
        inputs.push(await import(`./input-plugins/${inputPlugin}`))
        outputs.push(await import(`./output-plugins/${outputPlugin}`))
    } catch (e) {
        console.error('Error loading module');
    }

    console.log('INPUTS')
    console.log(inputs)
    console.log('OUTPUTS')
    console.log(outputs)
    debugger
});