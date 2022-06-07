import axios from 'axios'
import {SingleBar, Presets} from 'cli-progress'
import * as colors from 'ansi-colors'
import {UniversalDataFormatCategories} from "../interfaces/UniversalDataFormatCategories"
import {UniversalDataFormatItems} from "../interfaces/UniversalDataFormatItems"
import {UniversalDataFormat} from "../interfaces/UniversalDataFormat";

class Goldylocks {
  private credentials: URLSearchParams = new URLSearchParams()
  private readonly username: string
  private readonly password: string
  private goldyData: {
    articles: any,
    families: any
  }

  constructor(config) {
    const {username, password} = config
    this.credentials.append("username", username)
    this.credentials.append("password", password)
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

  #convertFamilies(): Array<UniversalDataFormatCategories>{
    const progressBar = new SingleBar({
      barsize: 25,
      format: `${colors.greenBright("[Goldylocks]")} Converting families... ${colors.greenBright("{bar}")} {value}/{total}`
    }, Presets.shades_classic)

    progressBar.start(this.goldyData.families.length, 0)

    let udfCategories: Array<UniversalDataFormatCategories> = []

    for(let i in this.goldyData.families){
      udfCategories.push({
        id: this.goldyData.families[i].id_familia,
        name: this.goldyData.families[i].descricao,
        parent: this.goldyData.families[i].familia_pai
      })

      progressBar.increment(1)
    }

    progressBar.stop()

    return udfCategories
  }

  #convertArticles(): Array<UniversalDataFormatItems>{
    const progressBar = new SingleBar({
      barsize: 25,
      format: `${colors.greenBright("[Goldylocks]")} Converting articles... ${colors.greenBright("{bar}")} {value}/{total}`
    }, Presets.shades_classic)

    progressBar.start(this.goldyData.articles.length, 0)

    let udfItems: Array<UniversalDataFormatItems> = []

    for(let i in this.goldyData.articles){
      udfItems.push({
        bar_code: this.goldyData.articles[i].cod_barras,
        brand: "",
        category: this.goldyData.articles[i].familia,
        description: this.goldyData.articles[i].nome,
        description_long: this.goldyData.articles[i].descricao_tecnica,
        description_short: this.goldyData.articles[i].nome,
        dimensions: {height: 0, width: 0},
        id: this.goldyData.articles[i].cod_barras,
        id_category: this.goldyData.articles[i].id_familia,
        image: "",
        min_sell: 0,
        pvp_1: this.goldyData.articles[i].pvp,
        stock: this.goldyData.articles[i].stock_atual,
        weight: 0
      })

      progressBar.increment(1)
    }

    progressBar.stop()

    return udfItems
  }

  async execute(): Promise<UniversalDataFormat> {
    return new Promise(async(resolve, reject) => {
      try {
        process.stdout.write(`${colors.greenBright("[Goldylocks]")} Obtaining Token... `)
        axios.defaults.headers.common['Authorization'] = await this.#getToken()
        axios.defaults.withCredentials = true
        process.stdout.write(`${colors.greenBright("Done")}\n`)

        process.stdout.write(`${colors.greenBright("[Goldylocks]")} Fetching families... `)
        this.goldyData.families = await this.#getFamilies()
        process.stdout.write(`${colors.greenBright("Done")}\n`)

        process.stdout.write(`${colors.greenBright("[Goldylocks]")} Fetching articles... `)
        this.goldyData.articles = await this.#getArticles()
        process.stdout.write(`${colors.greenBright("Done")}\n`)

        resolve({
          categories: this.#convertFamilies(),
          items: this.#convertArticles()
        })
      } catch (e) {
        console.error(`${colors.greenBright("[Goldylocks]")} ${e}`)
        reject(e)
      }
    })
  }
}

export {Goldylocks}
