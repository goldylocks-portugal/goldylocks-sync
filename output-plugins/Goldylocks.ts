import axios from 'axios'
import {SingleBar, Presets} from 'cli-progress'
import * as colors from 'ansi-colors'
import {UniversalDataFormatCategories} from "../interfaces/UniversalDataFormatCategories";

interface IDIndexItem {
    udfID: number,
    goldyID: number
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

  /**
   * getToken - Obtain a JWT token from the API
   * @private
   */
  async #getToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const res = await axios.post("https://devssl.goldylocks.pt/gl/api/obtertoken", this.credentials)

      if(res.data.token)
        resolve(res.data.token)
      else
        reject("Error obtaining Goldylocks token")
    })
  }

  /**
   * getFamilies - Obtains every family in Goldylocks
   * @private
   */
  async #getFamilies(){
    return new Promise(async (resolve, reject) => {
      const res = await axios.get("https://devssl.goldylocks.pt/gl/api/familias/")

      if(typeof res.data === "object" && res.data !== null)
        resolve(res.data)
      else
        reject("Error obtaining families")
    })
  }

  /**
   * getArticles - Obtains every article in Goldylocks
   * @private
   */
  async #getArticles(){
    return new Promise(async (resolve, reject) => {
      let res = await axios.get("https://devssl.goldylocks.pt/gl/api/numeroartigos")
      let nArtigos

      if(res.data) {
        nArtigos = res.data
      }
      else {
        reject("Error obtaining number of Goldylocks articles")
      }

      res = await axios.get(`https://devssl.goldylocks.pt/gl/api/artigos/?l=${nArtigos}`)

      if(typeof res.data === "object" && res.data !== null)
        resolve(res.data)
      else
        reject("Error obtaining Goldylocks articles")
    })
  }

  /**
   * createFamily - Creates a new family in Goldylocks and adds it's ID to idIndex
   * @param _family
   * @private
   */
  async #createFamily(_family){
    return new Promise<void>(async (resolve, reject) => {
      try {
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

  /**
   * createOrEditArticle - Creates/Edits an article in Goldylocks
   * @param _article
   * @private
   */
  async #createOrEditArticle(_article){
    return new Promise<void>(async (resolve, reject) => {
      try {
        let barCode = _article.get("cod_barras")

        if(!parseInt(barCode)) {
          let newBarCode = 0
          let barCodeAlreadyExists = false

          do {
            newBarCode = Math.floor(999999999999 - (Math.random() * 899999999999))
            barCodeAlreadyExists = this.goldyData.articles.some(e => e.bar_code == newBarCode)
          } while(barCodeAlreadyExists)

          _article.set("cod_barras", newBarCode)
        }

        const res = await axios.post("https://devssl.goldylocks.pt/gl/api/guardarartigo/?debug=1", _article)

        if(res.data == "ok")
          resolve()
        else {
          reject("Erro ao guardar artigo")
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * convertToGoldylocks - Transforms a UDF item into a Goldylocks Article
   * @param _item
   * @private
   */
  #convertToGoldylocks(_item) {
    let form = new URLSearchParams()
    form.append("cod_barras", _item.bar_code ?? "")
    form.append("nome", _item.description ?? "")
    form.append("familia", _item.id_category ?? "")
    form.append("preco_custo", _item.pvp_1 ?? "")
    form.append("desconto_fornecedor", "")
    form.append("custo_final", "")
    form.append("imposto", "")
    form.append("tipo", "")
    form.append("margem1", "")
    form.append("margem2", "")
    form.append("margem3", "")
    form.append("psi1", "")
    form.append("psi2", "")
    form.append("psi3", "")
    form.append("pci1", "")
    form.append("pci2", "")
    form.append("pci3", "")
    form.append("cotacao_atual", "")
    form.append("descricao_tecnica", _item.description_long ?? "")
    form.append("estado", "")
    form.append("bloquear_descontos", "")
    form.append("disponivel_webstore", "0") // Required
    form.append("posicao", "")
    form.append("peso", _item.weight ?? "")
    form.append("comprimento", "")
    form.append("largura", _item.dimensions ? (_item.dimensions.width ?? "") : "")
    form.append("altura", _item.dimensions ? (_item.dimensions.height ?? "") : "")
    form.append("unidade", "")
    form.append("lembrete", "")
    form.append("stock_minimo", "0") // Required
    form.append("segunda_unidade", "")
    form.append("racio_segunda_unidade", "")
    form.append("autorizacao_venda", "")
    form.append("movimenta_stock", "1") // Required
    form.append("id_artigo_anterior", "")
    form.append("webstore_tempo_entrega", "")
    form.append("processamento_lotes", "")
    form.append("tipo_artigo_composto", "")
    form.append("quantidade_automatica_stubs", "")
    form.append("plano_producao", "0") // Required

    return form
  }


  /**
   * parseFamilies - Runs through all UDF categories without a parent to see if they exist in Goldy.
   *                 If a family does not exist, it's created and it's new ID is saved.
   *                 If it exists, only it's ID is saved
   * @private
   */
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
      }

      progressBar.increment(1)
    }

    progressBar.stop()
  }

  /**
   * parseFamilyWithParent - Runs through all UDF categories of a specific parent to see if they exist in Goldy.
   *                         If a family does not exist, it's created and it's new ID is saved.
   *                         If it exists, only it's ID is saved
   * @param _family
   * @param _progressBar
   * @private
   */
  async #parseFamilyWithParent(_family: UniversalDataFormatCategories, _progressBar){
    const familyExistsInGoldy = this.goldyData.families.find(
      e => (e.familia_pai == _family.parent) && (e.descricao.toUpperCase() == _family.name.toUpperCase())
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

  /**
   * parseArticles - Runs through all UDF items and replaces their category IDs
   *                 with their corresponding IDs from Goldy.
   *                 Then the item is added (or updated) to Goldy.
   * @private
   */
  async #parseArticles(){
    const progressBar = new SingleBar({
      barsize: 25,
      format: `${colors.greenBright("[Goldylocks]")} Parsing articles... ${colors.greenBright("{bar}")} {value}/{total}`
    }, Presets.shades_classic)

    progressBar.start(this.data.items.length, 0)

    for(let i in this.data.items){
      this.data.items[i].id_category = this.idIndex.find(e => e.udfID == this.data.items[i].id_category).goldyID

      let goldyArticle = this.#convertToGoldylocks(this.data.items[i])
      await this.#createOrEditArticle(goldyArticle)

      progressBar.increment(1)
    }

    progressBar.stop()
  }

  async execute() {
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
    } catch (e) {
      console.error(`${colors.greenBright("\n[Goldylocks]")} ${e}`)
    }
  }
}

export {Goldylocks}
