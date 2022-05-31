import {UniversalDataFormat} from "../interfaces/UniversalDataFormat";

abstract class Plugin {
    abstract execute(): Promise<UniversalDataFormat>

}

export {
    Plugin,
}
