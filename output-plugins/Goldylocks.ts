import axios from 'axios'
import {UniversalDataFormatCategories} from "../interfaces/UniversalDataFormatCategories";

interface IDIndexItem {
    udfID: number,
    goldyID: number
}

interface GoldylocksDataFormatItems {
  cod_barras: string,
  nome: string,
  familia_pai: string,
  familia: string,
  preco_custo: string,
  desconto_fornecedor: string,
  custo_final: string,
  imposto: string,
  tipo: string,
  margem1: string,
  margem2: string,
  margem3: string,
  psi1: string,
  psi2: string,
  psi3: string,
  pci1: string,
  pci2: string,
  pci3: string,
  descricao_tecnica: string,
  estado: string,
  bloquear_descontos: string,
  disponivel_webstore: string,
  movimenta_stock: string,
  posicao: string,
  peso: string,
  comprimento: string,
  largura: string,
  altura: string,
  unidade: string,
  lembrete: string,
  segunda_unidade: string,
  racio_segunda_unidade: string,
  autorizacao_venda: string,
  stock_minimo: string,
  quantidade_automatica_stubs: string,
  tipo_artigo_composto: string,
  plano_producao: string,
}

class Goldylocks {
  private credentials: URLSearchParams = new URLSearchParams()
  private readonly username: string;
  private readonly password: string;
  private data: any;
  private idIndex: Array<IDIndexItem> = []

  constructor(config, data) {
    const {username, password} = config
    this.credentials.append("username", username)
    this.credentials.append("password", password)
    this.data = data
  }

  async #getToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const res = await axios.post("https://devssl.goldylocks.pt/gl/api/obtertoken", this.credentials)

      if(res.data.token)
        resolve(res.data.token)
      else
        reject("Error obtaining Goldylocks token")
    })
  }

  async #getFamilies(){
    return new Promise(async (resolve, reject) => {
      const res = await axios.get("https://devssl.goldylocks.pt/gl/api/familias/")

      if(typeof res.data === "object" && res.data !== null)
        resolve(res.data)
      else
        reject("Error obtaining Goldylocks families")
    })
  }

  /*async #createFamily(family){
    const res = await axios.post("https://devssl.goldylocks.pt/gl/api/inserirfamilia/")
  }*/

  #createFakeFamily(_family: UniversalDataFormatCategories){
    let newID = Math.floor(Math.random() * (10000 - 1) + 1)

    this.idIndex.push({
      udfID: _family.id,
      goldyID: newID
    })
  }

  /*async #convertToGoldylocks(UDF_items) {
    for(let i in UDF_items) {
      let GoldylocksItem: GoldylocksDataFormatItems = {
        altura: UDF_items["dimensions"]["height"] ?? "",
        autorizacao_venda: "",
        bloquear_descontos: "",
        cod_barras: UDF_items["bar_code"] ?? "",
        comprimento: "",
        custo_final: "",
        desconto_fornecedor: "",
        descricao_tecnica: UDF_items["description_long"] ?? "",
        disponivel_webstore: "",
        estado: "",
        familia: "",
        familia_pai: "",
        imposto: "",
        largura: UDF_items["dimensions"]["width"] ?? "",
        lembrete: "",
        margem1: "",
        margem2: "",
        margem3: "",
        movimenta_stock: "",
        nome: UDF_items["description"] ?? "",
        pci1: "",
        pci2: "",
        pci3: "",
        peso: "",
        plano_producao: "",
        posicao: "",
        preco_custo: UDF_items["pvp_1"] ?? "",
        psi1: "",
        psi2: "",
        psi3: "",
        quantidade_automatica_stubs: "",
        racio_segunda_unidade: "",
        segunda_unidade: "",
        stock_minimo: "",
        tipo: "",
        tipo_artigo_composto: "",
        unidade: ""
      }
    }
  }*/

  #parseFamilies(_udfFamilies: Array<UniversalDataFormatCategories>, _goldyFamilies: any){
    const familiesWithoutParent = _udfFamilies.filter(e => e.parent == 0)

    for(let i in familiesWithoutParent){
      const familyExistsInGoldy = _goldyFamilies.find(
        e => (e.familia_pai == 0) && (e.descricao == familiesWithoutParent[i].name)
      )

      if(familyExistsInGoldy) {
        this.idIndex.push({
          udfID: familiesWithoutParent[i].id,
          goldyID: familyExistsInGoldy.id_familia
        })
      } else {
        this.#createFakeFamily(familiesWithoutParent[i])
      }

      const familiesWithThisParent = _udfFamilies.filter(e => e.parent == familiesWithoutParent[i].id)

      for(let i in familiesWithThisParent)
        this.#parseFamilyWithParent(familiesWithThisParent[i], _udfFamilies, _goldyFamilies)
    }
  }

  #parseFamilyWithParent(_family: UniversalDataFormatCategories, _udfFamilies: Array<UniversalDataFormatCategories>, _goldyFamilies: any){
    const familyExistsInGoldy = _goldyFamilies.find(
      e => (e.familia_pai == _family.parent) && (e.descricao == _family.name)
    )

    if(familyExistsInGoldy) {
      this.idIndex.push({
        udfID: _family.id,
        goldyID: familyExistsInGoldy.id_familia
      })
    } else {
      this.#createFakeFamily(_family)
    }

    const familiesWithThisParent = _udfFamilies.filter(e => e.parent == _family.id)

    for(let i in familiesWithThisParent)
      this.#parseFamilyWithParent(familiesWithThisParent[i], _udfFamilies, _goldyFamilies)
  }

  async execute() {
    this.data = await import("../dummy_data.json")

    try {
      axios.defaults.headers.common['Authorization'] = await this.#getToken()
      axios.defaults.withCredentials = true

      let goldylocksFamilies = await this.#getFamilies()

      this.#parseFamilies(this.data.categories, goldylocksFamilies)

      // Apply new IDs
      for(let i in this.data.categories){
        this.data.categories[i].id = this.idIndex.find(e => e.udfID == this.data.categories[i].id).goldyID
        if(this.data.categories[i].parent != 0)
          this.data.categories[i].parent = this.idIndex.find(e => e.udfID == this.data.categories[i].parent).goldyID
      }

      debugger

      /*let goldylocks_items = await this.#convertToGoldylocks(this.data)*/
    } catch (e) {
      console.error(e)
    }
  }
}

export {Goldylocks}
