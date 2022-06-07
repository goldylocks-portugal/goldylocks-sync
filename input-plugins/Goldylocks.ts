<<<<<<< HEAD
class Goldylocks{
    execute(){

    }
}

export {Goldylocks}
=======
import axios from 'axios'
import {SingleBar, Presets} from 'cli-progress'
import * as colors from 'ansi-colors'
import {UniversalDataFormatCategories} from "../interfaces/UniversalDataFormatCategories";
import {UniversalDataFormatItems} from "../interfaces/UniversalDataFormatItems";

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
  private readonly username: string
  private readonly password: string
  private data: any
  private goldyData: {
    articles: any,
    families: any
  }
  private idIndex: Array<IDIndexItem> = []

  constructor(config, data) {
    const {username, password} = config
    this.credentials.append("username", username)
    this.credentials.append("password", password)
    this.data = data
    this.goldyData = {
      articles: [],
      families: []
    }
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
        reject("Error obtaining families")
    })
  }

  async #getArticles(){
    return new Promise(async (resolve, reject) => {
      //TODO: Use a new endpoint to get article number
      const res = await axios.get("https://devssl.goldylocks.pt/gl/api/artigos/?l=1000000000000000")

      if(typeof res.data === "object" && res.data !== null)
        resolve(res.data)
      else
        reject("Error obtaining Goldylocks articles")
    })
  }

  async #createFamily(_family){
    return new Promise<void>(async (resolve, reject) => {
      try {
        console.log(_family)
        const res = await axios.post("https://devssl.goldylocks.pt/gl/api/inserirfamilia/", null, {
          params: {
            p: _family.parent,
            d: _family.name
          }
        })

        if(res.data) {
          this.idIndex.push({
            udfID: _family.id,
            goldyID: res.data
          })
          resolve()
        }else{
          reject()
        }
      } catch (e) {
        reject(e)
      }

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

  async #parseFamilies(){
    const progressBar = new SingleBar({
      barsize: 25,
      format: `${colors.greenBright("[Goldylocks]")} Parsing families... ${colors.greenBright("{bar}")} {value}/{total}`
    }, Presets.shades_classic)

    progressBar.start(this.data.categories.length, 0)

    const familiesWithoutParent = this.data.categories.filter(e => e.parent == 0)

    for(let i in familiesWithoutParent){
      const familyExistsInGoldy = this.goldyData.families.find(
        e => (e.familia_pai == 0) && (e.descricao == familiesWithoutParent[i].name)
      )

      if(familyExistsInGoldy) {
        this.idIndex.push({
          udfID: familiesWithoutParent[i].id,
          goldyID: familyExistsInGoldy.id_familia
        })
      } else {
          await this.#createFamily(familiesWithoutParent[i])
      }

      const familiesWithThisParent = this.data.categories.filter(e => e.parent == familiesWithoutParent[i].id)

      for(let i in familiesWithThisParent) {
        familiesWithThisParent[i].parent = this.idIndex.find(e => e.udfID == familiesWithThisParent[i].parent).goldyID
        await this.#parseFamilyWithParent(familiesWithThisParent[i], progressBar)
        progressBar.increment(1)
      }

      progressBar.increment(1)
    }

    progressBar.stop()
  }

  async #parseFamilyWithParent(_family: UniversalDataFormatCategories, _progressBar){
    const familyExistsInGoldy = this.goldyData.families.find(
      e => (e.familia_pai == _family.parent) && (e.descricao == _family.name)
    )

    if(familyExistsInGoldy) {
      this.idIndex.push({
        udfID: _family.id,
        goldyID: familyExistsInGoldy.id_familia
      })
    } else {
        await this.#createFamily(_family)
    }

    const familiesWithThisParent = this.data.categories.filter(e => e.parent == _family.id)

    for(let i in familiesWithThisParent) {
      familiesWithThisParent[i].parent = this.idIndex.find(e => e.udfID == familiesWithThisParent[i].parent).goldyID
      await this.#parseFamilyWithParent(familiesWithThisParent[i], _progressBar)
      _progressBar.increment(1)
    }
  }

  async #parseArticles(){
    const progressBar = new SingleBar({
      barsize: 25,
      format: `${colors.greenBright("[Goldylocks]")} Parsing articles... ${colors.greenBright("{bar}")} {value}/{total}`
    }, Presets.shades_classic)

    progressBar.start(this.data.categories.length, 0)

    for(let i in this.data.categories){
      this.data.categories[i].id = this.idIndex.find(e => e.udfID == this.data.categories[i].id).goldyID

      //TODO: Criar / Atualizar artigo

      progressBar.increment(1)
    }

    progressBar.stop()
  }

  async execute() {
    this.data = await import("../dummy_data.json")

    try {
      process.stdout.write(`${colors.greenBright("[Goldylocks]")} Obtaining Token... `)
      axios.defaults.headers.common['Authorization'] = await this.#getToken()
      axios.defaults.withCredentials = true
      process.stdout.write(`${colors.greenBright("Done")}\n`)

      process.stdout.write(`${colors.greenBright("[Goldylocks]")} Fetching families... `)
      this.goldyData.families = await this.#getFamilies()
      process.stdout.write(`${colors.greenBright("Done")}\n`)

      await this.#parseFamilies()

      process.stdout.write(`${colors.greenBright("[Goldylocks]")} Fetching articles... `)
      this.goldyData.articles = await this.#getArticles()
      process.stdout.write(`${colors.greenBright("Done")}\n`)

      await this.#parseArticles()

      /*let goldylocks_items = await this.#convertToGoldylocks(this.data)*/
    } catch (e) {
      console.error(`${colors.greenBright("[Goldylocks]")} ${e}`)
    }
  }
}

export {Goldylocks}
>>>>>>> origin/2-create-goldylocks-output-plugin
