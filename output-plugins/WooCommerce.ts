import {UniversalDataFormatItems} from "../interfaces/UniversalDataFormatItems";
import {UniversalDataFormatCategories} from "../interfaces/UniversalDataFormatCategories";
import * as BarColors from 'ansi-colors'
import {SingleBar, Presets} from 'cli-progress'

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {UniversalDataFormat} from "../interfaces/UniversalDataFormat";

interface categoryIndexArray {
    originalID: string,
    woocommerceID: string
}

class WooCommerce {
    private _WooCommerce: any = {};
    private _allCategories: categoryIndexArray[] = [{
        originalID: "0", woocommerceID: "0"
    }];
    private _universalDataFormat: any

    constructor(config: any, data: any) {
        const array = {
            categories: [
                {id: 1, name: 'Familia', parent: 0},
                {id: 2, name: 'Linha Produto', parent: 1},
                {id: 3, name: 'Tipo Produto', parent: 2},
                {id: 4, name: 'Alimentar', parent: 0},
                {id: 5, name: 'Bebidas', parent: 4},
                {id: 6, name: 'Acessorios', parent: 5},
                {id: 7, name: 'Aguas', parent: 5},
                {id: 8, name: 'Cafe Capsulas', parent: 5},
                {id: 9, name: 'Cafe Grao', parent: 5},
                {id: 10, name: 'Cafe Moido', parent: 5},
                {id: 11, name: 'Cafe Pastilhas', parent: 5},
                {id: 12, name: 'Cafe Soluvel', parent: 5},
                {id: 13, name: 'Cha Branco', parent: 5},
                {id: 14, name: 'Cha Capsulas', parent: 5},
                {id: 15, name: 'Cha Carcadet', parent: 5},
                {id: 16, name: 'Cha Coffrets', parent: 5},
                {id: 17, name: 'Cha Criancas', parent: 5},
                {id: 18, name: 'Cha Descafeinado', parent: 5},
                {id: 19, name: 'Cha Escuro', parent: 5},
                {id: 20, name: 'Cha Frio', parent: 5},
                {id: 21, name: 'Cha Oolong', parent: 5},
                {id: 22, name: 'Cha Preto', parent: 5},
                {id: 23, name: 'Cha Rooibos', parent: 5},
                {id: 24, name: 'Cha Tisanas Ervas', parent: 5},
                {id: 25, name: 'Cha Verde', parent: 5},
                {id: 26, name: 'Chocolate', parent: 5},
                {id: 27, name: 'Leite', parent: 5},
                {id: 28, name: 'Licores', parent: 5},
                {id: 29, name: 'Vinho Branco', parent: 5},
                {id: 30, name: 'Vinho Espumante', parent: 5},
                {id: 31, name: 'Vinho Rosé', parent: 5},
                {id: 32, name: 'Vinho Tinto', parent: 5},
                {id: 33, name: 'Descartaveis', parent: 4},
                {id: 34, name: 'Copos Esferovite', parent: 33},
                {id: 35, name: 'Copos Papel', parent: 33},
                {id: 36, name: 'Copos PLA', parent: 33},
                {id: 37, name: 'Copos Plastico', parent: 33},
                {id: 38, name: 'Kit Cafe', parent: 33},
                {id: 39, name: 'Naperons', parent: 33},
                {id: 40, name: 'Palhinhas', parent: 33},
                {id: 41, name: 'Palhinhas Papel', parent: 33},
                {id: 42, name: 'Papel Siliconizado', parent: 33},
                {id: 43, name: 'Papel Vegetal', parent: 33},
                {id: 44, name: 'Paus Espetadas', parent: 33},
                {id: 45, name: 'Pratos Cana Acucar', parent: 33},
                {id: 46, name: 'Pratos Folha Palma', parent: 33},
                {id: 47, name: 'Pratos Papel', parent: 33},
                {id: 48, name: 'Pratos Plastico', parent: 33},
                {id: 49, name: 'Talheres Madeira', parent: 33},
                {id: 50, name: 'Talheres PLA', parent: 33},
                {id: 51, name: 'Talheres Plastico', parent: 33},
                {id: 52, name: 'Tigelas Cana Acucar', parent: 33},
                {id: 53, name: 'Tigelas Folha Palma', parent: 33},
                {id: 54, name: 'Tigelas Plastico', parent: 33},
                {id: 55, name: 'Toalhas Mesa', parent: 33},
                {id: 56, name: 'Desinfetantes', parent: 4},
                {id: 57, name: 'Frutas e Legumes', parent: 56},
                {id: 58, name: 'Embalagem', parent: 4},
                {id: 59, name: 'Caixas Aluminio', parent: 58},
                {id: 60, name: 'Caixas Batata Frita', parent: 58},
                {id: 61, name: 'Caixas Bolos', parent: 58},
                {id: 62, name: 'Caixas Cana Acucar', parent: 58},
                {id: 63, name: 'Caixas Cartao', parent: 58},
                {id: 64, name: 'Caixas Hamburguer', parent: 58},
                {id: 65, name: 'Caixas Hot Dog', parent: 58},
                {id: 66, name: 'Caixas Massas', parent: 58},
                {id: 67, name: 'Caixas Menu', parent: 58},
                {id: 68, name: 'Caixas Pizza', parent: 58},
                {id: 69, name: 'Caixas Plastico', parent: 58},
                {id: 70, name: 'Caixas Sopa', parent: 58},
                {id: 71, name: 'Caixas Sushi', parent: 58},
                {id: 72, name: 'Caixas Vinho', parent: 58},
                {id: 73, name: 'Contentor Termico', parent: 58},
                {id: 74, name: 'Frascos e Garrafas', parent: 58},
                {id: 75, name: 'Molheiras', parent: 58},
                {id: 76, name: 'Papel Anti-Gordura', parent: 58},
                {id: 77, name: 'Papel Charcutaria', parent: 58},
                {id: 78, name: 'Peliculas Aderentes', parent: 58},
                {id: 79, name: 'Rolo Aluminio', parent: 58},
                {id: 80, name: 'Saco Congelacao', parent: 58},
                {id: 81, name: 'Saco Vacuo', parent: 58},
                {id: 82, name: 'Saladeiras Cana A.', parent: 58},
                {id: 83, name: 'Saladeiras Cartao', parent: 58},
                {id: 84, name: 'Saladeiras PLA', parent: 58},
                {id: 85, name: 'Saquetas Talheres', parent: 58},
                {id: 86, name: 'Suporte Papel', parent: 58},
                {id: 87, name: 'Loicas', parent: 4},
                {id: 88, name: 'Acessorios', parent: 87},
                {id: 89, name: 'Acucareiros', parent: 87},
                {id: 90, name: 'Bules', parent: 87},
                {id: 91, name: 'Canecas e Chavenas', parent: 87},
                {id: 92, name: 'Chavenas Art Collect', parent: 87},
                {id: 93, name: 'Copos', parent: 87},
                {id: 94, name: 'Copos Tritan', parent: 87},
                {id: 95, name: 'Jarros', parent: 87},
                {id: 96, name: 'Mercearia', parent: 4},
                {id: 97, name: 'Acucar', parent: 96},
                {id: 98, name: 'Edulcorante', parent: 96},
                {id: 99, name: 'Snack', parent: 96},
                {id: 100, name: 'Pequenos Domesticos', parent: 4},
            ],
            items: [
                {
                    id_category: 6,
                    bar_code: 3259920015251,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Filtro de Chá Descartável para Bule 64un',
                    description_short: 'Filtro de Chá Descartável para Bule 64un',
                    description_long: 'Estes filtros universais para chá são adequados para todos os tipos de chá a granel. De sabor neutro, permitem a infusão de chás de folhas ou chás de ervas. Resistente, o papel não se desfaz mesmo depois de muito tempo embebido em água. Ideal para al préaração do infusor em bule, podendo ser utilizado também em xícara alta.',
                    id: 6591525,
                    image: 'http://www.netimagens.com/images/produtos/6591525.jpg',
                    min_sell: 1,
                    pvp_1: 4.45,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.06
                },
                {
                    id_category: 6,
                    bar_code: 3259920015282,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Filtro de Chá Descartável para Bule 30un',
                    description_short: 'Filtro de Chá Descartável para Bule 30un',
                    description_long: '',
                    id: 6591528,
                    image: 'http://www.netimagens.com/images/produtos/6591528.jpg',
                    min_sell: 1,
                    pvp_1: 2.23,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.04
                },
                {
                    id_category: 6,
                    bar_code: 3259920067596,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Filtro de Chá em Inox para Bule de Porcelana 0,5L',
                    description_short: 'Filtro de Chá em Inox para Bule de Porcelana 0,5L',
                    description_long: 'Dimensões: Ø 5,5 cm / altura 8 cm',
                    id: 6597596,
                    image: 'http://www.netimagens.com/images/produtos/6597596.jpg',
                    min_sell: 1,
                    pvp_1: 3.09,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.04
                },
                {
                    id_category: 6,
                    bar_code: 5600356598374,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Caixa Vazia com 6 Compartimentos de Chá em Madeira Bordeaux',
                    description_short: 'Caixa Vazia com 6 Compartimentos de Chá em Madeira Bordeaux',
                    description_long: 'Caixa de madeira cor de vinho com placa de latão na tampa e interior em madeira natural.\n' +
                        'Interior organizado em 6 caixas para saquetas de Chás Cristal® embaladas individualmente.',
                    id: 6598374,
                    image: 'http://www.netimagens.com/images/produtos/6598374.jpg',
                    min_sell: 1,
                    pvp_1: 38.5,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.68
                },
                {
                    id_category: 6,
                    bar_code: 3259920099023,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Mini Lata Vazia para 6/8 Saquetas de Chá em Metal',
                    description_short: 'Mini Lata Vazia para 6/8 Saquetas de Chá em Metal',
                    description_long: 'Mini Lata  revestida a cobre para 6/8 sachês\n' +
                        'Dimensões: 6 x 6 cm / altura 5 cm',
                    id: 6599023,
                    image: 'http://www.netimagens.com/images/produtos/6599023_1.JPG',
                    min_sell: 20,
                    pvp_1: 2.08,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.03
                },
                {
                    id_category: 6,
                    bar_code: 3259920058357,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Infusor de Chá Colher Bola Perfurada Aço Inoxidável',
                    description_short: 'Infusor de Chá Colher Bola Perfurada Aço Inoxidável',
                    description_long: 'Colher de chá infusora - bola inox perfurada\n' +
                        'Dimensões: Ø / H: 4,8 / 13,5 cm',
                    id: 6955835,
                    image: 'http://www.netimagens.com/images/produtos/6955835.JPG',
                    min_sell: 1,
                    pvp_1: 3.96,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.05
                },
                {
                    id_category: 6,
                    bar_code: 3259920059934,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Infusor de Chá com Mini Chávena',
                    description_short: 'Infusor de Chá com Mini Chávena',
                    description_long: 'Uma bola de chá chique decorada com a reprodução de uma "mini xícara" de resina. Fabricado em aço inoxidável e malha fina, é adequado para a infusão de todos os tipos de chás. Dimensões: Ø 4,5 cm',
                    id: 6955993,
                    image: 'http://www.netimagens.com/images/produtos/6955993.1.JPG',
                    min_sell: 1,
                    pvp_1: 3.47,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.04
                },
                {
                    id_category: 6,
                    bar_code: 3259920075064,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Porta Bolsas para 6 Saquetas de Chá Prateado',
                    description_short: 'Porta Bolsas para 6 Saquetas de Chá Prateado',
                    description_long: 'Este prático porta-bolsas cabe facilmente no bolso, na bolsa, na bagagem ... Bolsa em pele sintética com fecho de botões em níquel, até 6 saquetas\n' +
                        'Limpe com um pano húmido. Artigo disponível em cinco cores: preto, vermelho, marfim, camelo, prata.\n' +
                        '\n' +
                        'Dimensões: W / H / D: 12/4/6 cm',
                    id: 6957506,
                    image: 'http://www.netimagens.com/images/produtos/6957506_0.JPG',
                    min_sell: 1,
                    pvp_1: 3.09,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.06
                },
                {
                    id_category: 6,
                    bar_code: 3259920075996,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Infusor de Chá Bola Perfurada com Pinça Aço Inoxidável',
                    description_short: 'Infusor de Chá Bola Perfurada com Pinça Aço Inoxidável',
                    description_long: 'Dimensões: Ø5cm  / L 17 cm',
                    id: 6957599,
                    image: 'http://www.netimagens.com/images/produtos/6957599.JPG',
                    min_sell: 1,
                    pvp_1: 2.33,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.06
                },
                {
                    id_category: 6,
                    bar_code: 3259920090289,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Infusor de Chá Bola Perfurada com Corrente Aço Inoxidável',
                    description_short: 'Infusor de Chá Bola Perfurada com Corrente Aço Inoxidável',
                    description_long: 'Infusor de chá- bola em inox - perfurada - Ø4cm',
                    id: 6959028,
                    image: 'http://www.netimagens.com/images/produtos/6959028.JPG',
                    min_sell: 1,
                    pvp_1: 2.72,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.03
                },
                {
                    id_category: 6,
                    bar_code: 3259920098698,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Porta Bolsas para 6 Saquetas de Chá Preto',
                    description_short: 'Porta Bolsas para 6 Saquetas de Chá Preto',
                    description_long: 'Este prático porta-bolsas cabe facilmente no bolso, na bolsa, na bagagem ... Bolsa em pele sintética com fecho de botões em níquel, até 6 saquetas\n' +
                        'Limpe com um pano húmido. Artigo disponível em cinco cores: preto, vermelho, marfim, camelo, prata.\n' +
                        '\n' +
                        'Dimensões: W / H / D: 12/4/6 cm',
                    id: 6959869,
                    image: 'http://www.netimagens.com/images/produtos/6959869.jpg',
                    min_sell: 1,
                    pvp_1: 3.09,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.06
                },
                {
                    id_category: 6,
                    bar_code: 3259920098711,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Porta Bolsas para 6 Saquetas de Chá Bordeaux',
                    description_short: 'Porta Bolsas para 6 Saquetas de Chá Bordeaux',
                    description_long: 'Este prático porta-bolsas cabe facilmente no bolso, na bolsa, na bagagem ... Bolsa em pele sintética com fecho de botões em níquel, até 6 saquetas. \n' +
                        'Limpe com um pano húmido. Artigo disponível em cinco cores: preto, vermelho, marfim, camelo, prata.\n' +
                        'Dimensões: W / H / D: 12/4/6 cm',
                    id: 6959871,
                    image: 'http://www.netimagens.com/images/produtos/6959871.jpg',
                    min_sell: 1,
                    pvp_1: 3.09,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.06
                },
                {
                    id_category: 6,
                    bar_code: 3259920058395,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Infusor de Chá com Mini Bule',
                    description_short: 'Infusor de Chá com Mini Bule',
                    description_long: 'Uma bola de chá chique com um "bule" de resina no final de sua corrente. Fabricado em aço inox e peneira fina, é adequado para a infusão de todos os tipos de chás.\n' +
                        'Ø 4,5 cm',
                    id: '695NDR5839',
                    image: 'http://www.netimagens.com/images/produtos/695NDR5839.1.JPG',
                    min_sell: 1,
                    pvp_1: 3.47,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0.05
                },
                {
                    id_category: 6,
                    bar_code: 3259920058494,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Acessorios',
                    description: 'Infusor de Chá com Mini Lata',
                    description_short: 'Infusor de Chá com Mini Lata',
                    description_long: 'Bola de chá no final da corrente com uma miniatura representando a tradicional caixa de chá Dammann "Taste Russian Douchka". Possui um crivo fino, adequado para infusão com todos os tipos de folhas de chá, chás de ervas e rooibos. Ø 4,5 cm',
                    id: '695NDR5849',
                    image: 'http://www.netimagens.com/images/produtos/695NDR5849.1.JPG',
                    min_sell: 1,
                    pvp_1: 3.78,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.05
                },
                {
                    id_category: 7,
                    bar_code: 5600742454069,
                    brand: 'H2OPE',
                    category: 'Aguas',
                    description: 'Água de Nascente H2OPE 0,33L Pack 24un',
                    description_short: 'Água de Nascente H2OPE 0,33L Pack 24un',
                    description_long: 'Desde 1984, é a água que nasce e vem diretamente da montanha no seu estado mais puro. Foi premiada como uma das melhores águas de nascente, por ser pura, cristalina e de qualidade superior.\n' +
                        'As nossas águas têm o pH mais equilibrado do mercado, pois é o mais próximo do valor neutro. O nosso organismo procura manter o sangue com um pH estável, próximo de 7.\n' +
                        '\n' +
                        'Pensando no futuro e no meio ambiente, as nossas águas apostam em garrafas 25% PET, apelando sempre para o facto do seu plástico ser 100% reciclável. somos pioneiros nesta inovação, adotando um conceito Ecogreen, promovendo o nosso " ciclo de Reciclagem Sempre".\n' +
                        'Esperamos que para o futuro, as nossas garrafas sejam 100% R.PET.\n' +
                        '\n' +
                        'Composição química:\n' +
                        'pH 6,6\n' +
                        'Mineralização total 86\n' +
                        'Bicarbonato 26,6\n' +
                        'Cloreto 4,8\n' +
                        'Nitrato 0,8\n' +
                        'Cálcio 2,7\n' +
                        'Sódio 10\n' +
                        'Magnésio 1,8\n' +
                        'Sílica 28',
                    id: 6791018,
                    image: 'http://www.netimagens.com/images/produtos/6791018_0.JPG',
                    min_sell: 1,
                    pvp_1: 1.98,
                    pvp_2: 1.75,
                    stock: '>1001',
                    weight: 8.68
                },
                {
                    id_category: 7,
                    bar_code: 5600742454083,
                    brand: 'H2OPE',
                    category: 'Aguas',
                    description: 'Água de Nascente H2OPE 1,5L Pack 6un',
                    description_short: 'Água de Nascente H2OPE 1,5L Pack 6un',
                    description_long: 'Desde 1984, é a água que nasce e vem diretamente da montanha no seu estado mais puro. Foi premiada como uma das melhores águas de nascente, por ser pura, cristalina e de qualidade superior.\n' +
                        'As nossas águas têm o pH mais equilibrado do mercado, pois é o mais próximo do valor neutro. O nosso organismo procura manter o sangue com um pH estável, próximo de 7.\n' +
                        '\n' +
                        'Pensando no futuro e no meio ambiente, as nossas águas apostam em garrafas 25% PET, apelando sempre para o facto do seu plástico ser 100% reciclável. somos pioneiros nesta inovação, adotando um conceito Ecogreen, promovendo o nosso " ciclo de Reciclagem Sempre".\n' +
                        'Esperamos que para o futuro, as nossas garrafas sejam 100% R.PET.\n' +
                        '\n' +
                        'Composição química:\n' +
                        'pH 6,6\n' +
                        'Mineralização total 86\n' +
                        'Bicarbonato 26,6\n' +
                        'Cloreto 4,8\n' +
                        'Nitrato 0,8\n' +
                        'Cálcio 2,7\n' +
                        'Sódio 10\n' +
                        'Magnésio 1,8\n' +
                        'Sílica 28',
                    id: 6791020,
                    image: 'http://www.netimagens.com/images/produtos/6791020_0.JPG',
                    min_sell: 1,
                    pvp_1: 1.3,
                    pvp_2: 1.05,
                    stock: '>1001',
                    weight: 9.46
                },
                {
                    id_category: 7,
                    bar_code: 5600742454090,
                    brand: 'H2OPE',
                    category: 'Aguas',
                    description: 'Água de Nascente H2OPE 6L Pack 2un',
                    description_short: 'Água de Nascente H2OPE 6L Pack 2un',
                    description_long: 'Desde 1984, é a água que nasce e vem diretamente da montanha no seu estado mais puro. Foi premiada como uma das melhores águas de nascente, por ser pura, cristalina e de qualidade superior.\n' +
                        'As nossas águas têm o pH mais equilibrado do mercado, pois é o mais próximo do valor neutro. O nosso organismo procura manter o sangue com um pH estável, próximo de 7.\n' +
                        '\n' +
                        'Pensando no futuro e no meio ambiente, as nossas águas apostam em garrafas 25% PET, apelando sempre para o facto do seu plástico ser 100% reciclável. somos pioneiros nesta inovação, adotando um conceito Ecogreen, promovendo o nosso " ciclo de Reciclagem Sempre".\n' +
                        'Esperamos que para o futuro, as nossas garrafas sejam 100% R.PET.\n' +
                        '\n' +
                        'Composição química:\n' +
                        'pH 6,6\n' +
                        'Mineralização total 86\n' +
                        'Bicarbonato 26,6\n' +
                        'Cloreto 4,8\n' +
                        'Nitrato 0,8\n' +
                        'Cálcio 2,7\n' +
                        'Sódio 10\n' +
                        'Magnésio 1,8\n' +
                        'Sílica 28',
                    id: 6791021,
                    image: 'http://www.netimagens.com/images/produtos/6791021_0.JPG',
                    min_sell: 1,
                    pvp_1: 1.45,
                    pvp_2: 1.15,
                    stock: '101--1000',
                    weight: 12.21
                },
                {
                    id_category: 7,
                    bar_code: 5601314222260,
                    brand: 'VITALIS',
                    category: 'Aguas',
                    description: 'Água Mineral Vitalis 0,33L Pack 24',
                    description_short: 'Água Mineral Vitalis 0,33L Pack 24',
                    description_long: 'Com uma composição e sabor únicos fruto da Pureza Original procedente do coração quartzítico de espaços naturais protegidos.\n' +
                        'A sua mineralização torna-a ideal na manutenção do equilíbrio interior pelo seu potencial de hidratação.\n' +
                        'A Água Mineral Natural é caracterizada pela sua pureza original. \n' +
                        'A sua origem subterrânea protege-a de agressões externas, possuindo características estáveis e permanentes, sendo microbiologicamente sã, não sofrendo qualquer contaminação humana ou tratamento químico, representando uma opção natural, oferecida pela natureza, sem adição de químicos, que fornece, sais minerais e oligoelementos imprescindíveis ao organismo como complemento natural à dieta diária.\n' +
                        '\n' +
                        'Ideal para reuniões.',
                    id: 6791001,
                    image: 'http://www.netimagens.com/images/produtos/6791001_0.JPG',
                    min_sell: 1,
                    pvp_1: 3.94,
                    pvp_2: 3.7,
                    stock: '11--100',
                    weight: 8.33
                },
                {
                    id_category: 7,
                    bar_code: 5601314223267,
                    brand: 'VITALIS',
                    category: 'Aguas',
                    description: 'Água Mineral Vitalis 0,5L Pack 24',
                    description_short: 'Água Mineral Vitalis 0,5L Pack 24',
                    description_long: 'Com uma composição e sabor únicos fruto da Pureza Original procedente do coração quartzítico de espaços naturais protegidos.\n' +
                        'A sua mineralização torna-a ideal na manutenção do equilíbrio interior pelo seu potencial de hidratação.\n' +
                        'A Água Mineral Natural é caracterizada pela sua pureza original. \n' +
                        'A sua origem subterrânea protege-a de agressões externas, possuindo características estáveis e permanentes, sendo microbiologicamente sã, não sofrendo qualquer contaminação humana ou tratamento químico, representando uma opção natural, oferecida pela natureza, sem adição de químicos, que fornece, sais minerais e oligoelementos imprescindíveis ao organismo como complemento natural à dieta diária.\n' +
                        '\n' +
                        'Ideal para reuniões.',
                    id: 6791002,
                    image: 'http://www.netimagens.com/images/produtos/6791002_0.JPG',
                    min_sell: 1,
                    pvp_1: 4.57,
                    pvp_2: 4.28,
                    stock: '11--100',
                    weight: 12.54
                },
                {
                    id_category: 7,
                    bar_code: 5601314225230,
                    brand: 'VITALIS',
                    category: 'Aguas',
                    description: 'Água Mineral Vitalis 1,5L Pack 12',
                    description_short: 'Água Mineral Vitalis 1,5L Pack 12',
                    description_long: 'Com uma composição e sabor únicos fruto da Pureza Original procedente do coração quartzítico de espaços naturais protegidos.\n' +
                        'A sua mineralização torna-a ideal na manutenção do equilíbrio interior pelo seu potencial de hidratação.\n' +
                        'A Água Mineral Natural é caracterizada pela sua pureza original. \n' +
                        'A sua origem subterrânea protege-a de agressões externas, possuindo características estáveis e permanentes, sendo microbiologicamente sã, não sofrendo qualquer contaminação humana ou tratamento químico, representando uma opção natural, oferecida pela natureza, sem adição de químicos, que fornece, sais minerais e oligoelementos imprescindíveis ao organismo como complemento natural à dieta diária.',
                    id: 6791005,
                    image: 'http://www.netimagens.com/images/produtos/6791005_0.JPG',
                    min_sell: 1,
                    pvp_1: 4.1,
                    pvp_2: 3.85,
                    stock: '11--100',
                    weight: 18.49
                },
                {
                    id_category: 8,
                    bar_code: 8435336216078,
                    brand: 'BOGANI',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas Cappuccino Origen Sensation DG 16un',
                    description_short: 'Café Cápsulas Cappuccino Origen Sensation (Dolce Gusto) Caixa 16 unidades * 10g',
                    description_long: 'Compativel com a marca Dolce Gusto.\n' +
                        'Preparado para Bebida Solúvel com sabor a Cappuccino\n' +
                        '\n' +
                        'Ingredientes e alergénios: \n' +
                        'Açúcar, xarope de glucose seco, sem gorduras trans de coco, café em pó (10%), soro de leite em pó (6,4%), leite em pó desnatado, cacau baixo teor de gordura, estabilizador: E340ii, sal, anti-aglomerante: E551, emulsionante: E471',
                    id: 6591315,
                    image: 'http://www.netimagens.com/images/produtos/6591315.JPG',
                    min_sell: 1,
                    pvp_1: 2.76,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.28
                },
                {
                    id_category: 8,
                    bar_code: 8435336210045,
                    brand: 'BOGANI',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas Avelã Origen Sensation DG 16un',
                    description_short: 'Café Cápsulas Avelã Origen Sensation (Dolce Gusto) Caixa 16 unidades * 7g',
                    description_long: 'Compativel com a marca Dolce Gusto\n' +
                        'Ingredientes e alergénios: Café (98%), Aroma de Avelã (1,5%), Avelã natural (0,5%)',
                    id: 6591316,
                    image: 'http://www.netimagens.com/images/produtos/6591316.JPG',
                    min_sell: 1,
                    pvp_1: 2.76,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.26
                },
                {
                    id_category: 8,
                    bar_code: 8435336216061,
                    brand: 'BOGANI',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas com Leite Origen Sensation DG 16un',
                    description_short: 'Café Cápsulas com Leite Origen Sensation (Dolce Gusto) Caixa 16 unidades * 10g',
                    description_long: 'Compativel com a marca Dolce Gusto\n' +
                        'Preparado de Leite em Pó e Café Solúvel \n' +
                        'Ingredientes e alergénios: Leite em pó desnatado (53%), açúcar, café em pó (23%)',
                    id: 6591317,
                    image: 'http://www.netimagens.com/images/produtos/6591317.JPG',
                    min_sell: 1,
                    pvp_1: 2.76,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.29
                },
                {
                    id_category: 8,
                    bar_code: 8435336216030,
                    brand: 'BOGANI',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas Descafeinado Origen Sensation DG 16un',
                    description_short: 'Café Cápsulas Descafeinado Origen Sensation (Dolce Gusto) Caixa 16 unidades * 7g',
                    description_long: 'Compativel com a marca Dolce Gusto\nCafé torrado moido',
                    id: 6591318,
                    image: 'http://www.netimagens.com/images/produtos/6591318.JPG',
                    min_sell: 1,
                    pvp_1: 2.76,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.25
                },
                {
                    id_category: 8,
                    bar_code: 8435336216139,
                    brand: 'BOGANI',
                    category: 'Cafe Capsulas',
                    description: 'Cápsulas Leite Origen Sensations DG 16un',
                    description_short: 'Cápsulas Leite Origen Sensations (Dolce Gusto) Caixa 16 unidades * 13g',
                    description_long: 'Compativel com a marca Dolce Gusto\n' +
                        'Ingredientes e alergénios: Leite desnatado em pó (41%), soro de leite, açúcar, leite inteiro em pó (10%), antiaglomerantes E341(iii)',
                    id: 6591321,
                    image: 'http://www.netimagens.com/images/produtos/6591321.JPG',
                    min_sell: 1,
                    pvp_1: 2.76,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0.33
                },
                {
                    id_category: 8,
                    bar_code: 8435336216177,
                    brand: 'BOGANI',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas Biológico Arábica Origen Sensations DG 16un',
                    description_short: 'Café Cápsulas Biológico Arábica Origen Sensations (Dolce Gusto) Caixa 16 unidades * 7G',
                    description_long: 'Compativel com a marca Dolce Gusto\n100% Café Arábica Biológico',
                    id: 6591323,
                    image: 'http://www.netimagens.com/images/produtos/6591323.JPG',
                    min_sell: 1,
                    pvp_1: 3.06,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.26
                },
                {
                    id_category: 8,
                    bar_code: 5600295025228,
                    brand: 'COFFEETHERAPY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas CoffeeTherapy Extra Forte DG 16un',
                    description_short: 'Café Cápsulas CoffeeTherapy Extra Forte para Dolce Gusto 16un',
                    description_long: 'Café Extra Forte, Intensidade 9\n' +
                        'Categoria: Coffeetherapy® - compatível Dolce Gusto®\n' +
                        '\n' +
                        'O Extra Forte Coffeetherapy® é um café com uma intensidade excecional apresentando um forte sabor e uma textura densa e cremosa.\n' +
                        'Os grãos selecionados dos cafés IPAC são torrados lentamente de forma artesanal, proporcionando um sabor longo, agradável e cremoso, um verdadeiro café espresso.\n' +
                        'Após o uso, as cápsulas Coffeetherapy® Extra Forte compatíveis Dolce Gusto® devem ser descartadas no Ecoponto Azul. Colabore para a preservação de nosso Meio Ambiente.\n' +
                        'Café espresso encorpado, com creme consistente, suave e aromático, de paladar apurado.\n' +
                        '* Marca registada em nome de empresa não relacionada com Ipac Cafés.',
                    id: 6591329,
                    image: 'http://www.netimagens.com/images/produtos/6591329.JPG',
                    min_sell: 2,
                    pvp_1: 2.62,
                    pvp_2: 2.48,
                    stock: '11--100',
                    weight: 0.23
                },
                {
                    id_category: 8,
                    bar_code: 5600393530822,
                    brand: 'COFFEETHERAPY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas CoffeeTherapy Fortissimo DG 30un',
                    description_short: 'Café Cápsulas CoffeeTherapy Fortissimo para Dolce Gusto 30un',
                    description_long: 'Café Fortíssimo, Intensidade 10\n' +
                        'Categoria: Coffeetherapy® - compatível Dolce Gusto®\n' +
                        '\n' +
                        'O Fortíssimo Coffeetherapy® é um café com uma intensidade excecional apresentando um forte sabor e uma textura densa e cremosa.\n' +
                        'Os grãos selecionados dos cafés IPAC são torrados lentamente de forma artesanal, proporcionando um sabor longo, agradável e cremoso, um verdadeiro café espresso.\n' +
                        'Após o uso, as cápsulas Coffeetherapy® Fortíssimo compatíveis Dolce Gusto® devem ser descartadas no Ecoponto Azul. Colabore para a preservação de nosso Meio Ambiente.\n' +
                        'Café espresso encorpado, com creme consistente, suave e aromático, de paladar apurado.\n' +
                        '* Marca registada em nome de empresa não relacionada com Ipac Cafés.',
                    id: 6591330,
                    image: 'http://www.netimagens.com/images/produtos/6591330_0.JPG',
                    min_sell: 1,
                    pvp_1: 4.5,
                    pvp_2: 4.21,
                    stock: '11--100',
                    weight: 0.42
                },
                {
                    id_category: 8,
                    bar_code: 5600295025273,
                    brand: 'COFFEETHERAPY',
                    category: 'Cafe Capsulas',
                    description: 'Cápsulas Caramelo CoffeeTherapy DG 10un',
                    description_short: 'Cápsulas Caramelo CoffeeTherapy para Dolce Gusto 10un',
                    description_long: '',
                    id: 6591332,
                    image: 'http://www.netimagens.com/images/produtos/6591332.JPG',
                    min_sell: 1,
                    pvp_1: 2.62,
                    pvp_2: 2.43,
                    stock: '11--100',
                    weight: 0.22
                },
                {
                    id_category: 8,
                    bar_code: 5600295025259,
                    brand: 'COFFEETHERAPY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas CoffeeTherapy Descafeinado DG 16un',
                    description_short: 'Café Cápsulas CoffeeTherapy Descafeinado DG 16un',
                    description_long: 'Compativel com a marca Dolce Gusto\n' +
                        'Intensidade 5\n' +
                        '\n' +
                        'Descafeinado com uma intensidade excecional, apresentando um forte sabor e uma textura densa e cremosa.',
                    id: 6591334,
                    image: 'http://www.netimagens.com/images/produtos/6591334_0.JPG',
                    min_sell: 1,
                    pvp_1: 2.59,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.22
                },
                {
                    id_category: 8,
                    bar_code: 5600295025297,
                    brand: 'COFFEETHERAPY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas CoffeeTherapy p/Nespresso Extra Forte 10un',
                    description_short: 'Café Cápsulas CoffeeTherapy p/Nespresso Extra Forte 10un',
                    description_long: 'O café é uma das bebidas mais consumidas em todo o mundo! Descubra o sabor e a intensidade do nosso café.\n' +
                        '\n' +
                        'Textura / Intensidade: 9\n' +
                        'Tipo de produto: Nespresso e Compatíveis',
                    id: 6591335,
                    image: 'http://www.netimagens.com/images/produtos/6591335.JPG',
                    min_sell: 3,
                    pvp_1: 1.58,
                    pvp_2: 1.5,
                    stock: '101--1000',
                    weight: 0.09
                },
                {
                    id_category: 8,
                    bar_code: 5600295025280,
                    brand: 'COFFEETHERAPY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas CoffeeTherapy p/Nespresso Fortissimo 10un',
                    description_short: 'Café Cápsulas CoffeeTherapy p/Nespresso Fortissimo 10un',
                    description_long: 'O café é uma das bebidas mais consumidas em todo o mundo! Descubra o sabor e a intensidade do nosso café.\n' +
                        '\n' +
                        'Textura / Intensidade: 10\n' +
                        'Tipo de produto: Nespresso e Compatíveis',
                    id: 6591336,
                    image: 'http://www.netimagens.com/images/produtos/6591336.JPG',
                    min_sell: 3,
                    pvp_1: 1.58,
                    pvp_2: 1.5,
                    stock: '11--100',
                    weight: 0.09
                },
                {
                    id_category: 8,
                    bar_code: 5601082026954,
                    brand: 'DELTA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas Delta Q Qonvictus 10un',
                    description_short: 'Café Cápsulas Delta Q Qonvictus 10un',
                    description_long: 'Delta Q Qonvictus é um blend clássico e equilibrado que resulta da combinação dos melhores cafés da Tanzânia e da Costa Rica. Qonvictus dá origem a um expresso intenso e encorpado, rico em notas de caramelo e de chocolate, com uma acidez delicada.\n' +
                        'Intensidade: 5',
                    id: 6591403,
                    image: 'http://www.netimagens.com/images/produtos/6591403.JPG',
                    min_sell: 2,
                    pvp_1: 2.1,
                    pvp_2: 2.03,
                    stock: 0,
                    weight: 0.14
                },
                {
                    id_category: 8,
                    bar_code: 5601082039800,
                    brand: 'DELTA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas Delta Q Qalidus Pack XL40',
                    description_short: 'Café Cápsulas Delta Q Qalidus Pack XL40',
                    description_long: 'Delta Q Qalidus nasce da fusão de cafés robusta de Angola e dos Camarões e cafés arábica das Honduras. Qalidus dá origem a um expresso muito intenso e encorpado, agora disponível em pack XL com 40 cápsulas\n' +
                        'Intensidade: 10',
                    id: 6591407,
                    image: 'http://www.netimagens.com/images/produtos/6591407.JPG',
                    min_sell: 1,
                    pvp_1: 9.02,
                    pvp_2: 8.75,
                    stock: '11--100',
                    weight: 0.56
                },
                {
                    id_category: 8,
                    bar_code: 5601082039817,
                    brand: 'DELTA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas Delta Q Qharacter Pack XL40',
                    description_short: 'Café Cápsulas Delta Q Qharacter Pack XL40',
                    description_long: 'Delta Q Qharacter é um blend intenso e de aroma persistente, que agora está disponível em Pack XL, com 40 cápsulas. Desfrute do melhor café colombiano aliado à mais requintada selecção de cafés do Brasil e da Costa do Marfim com o Pack Delta Q Qharacter.\n' +
                        'Intensidade: 9',
                    id: 6591408,
                    image: 'http://www.netimagens.com/images/produtos/6591408.JPG',
                    min_sell: 1,
                    pvp_1: 9.02,
                    pvp_2: 8.75,
                    stock: '11--100',
                    weight: 0.56
                },
                {
                    id_category: 8,
                    bar_code: 5601082042657,
                    brand: 'DELTA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas Delta Q aQtivus Pack XL40',
                    description_short: 'Café Cápsulas Delta Q aQtivus Pack XL40',
                    description_long: 'Delta Q aQtivus XL oferece-lhe 40 cápsulas de um blend intenso e estimulante que resulta num expresso com aroma a noz torrada, um leve toque frutado e alguma acidez.\n' +
                        'Intensidade: 8',
                    id: 6591409,
                    image: 'http://www.netimagens.com/images/produtos/6591409.JPG',
                    min_sell: 1,
                    pvp_1: 9.02,
                    pvp_2: 8.75,
                    stock: '11--100',
                    weight: 0.56
                },
                {
                    id_category: 8,
                    bar_code: 8003753937595,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas IES ILLY Tostatura Média 100un',
                    description_short: 'Café Cápsulas IES ILLY Tostatura Média 100un          Funcionam na Maquina Cafeé Cápsulas Expresso Mitaca Cube ref:6951078',
                    description_long: 'O sistema de cápsulas IES illycaffè (I-Espresso System) é uma colaboração entre a illy e mitaca para atender às necessidades atuais de escritórios.\n' +
                        'As cápsulas embaladas individualmente em atmosfera protectora, contém a porção exacta de café para um espresso perfeito. \n' +
                        'A parte inferior da cápsula é um sistema, inovador que permite a infusão de todo o café.\n' +
                        'Funcionam na Maquina Cafeé Cápsulas Expresso Mitaca Cube ref:6951078',
                    id: 6600876,
                    image: 'http://www.netimagens.com/images/produtos/6600876.jpg',
                    min_sell: 1,
                    pvp_1: 26,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 1.55
                },
                {
                    id_category: 8,
                    bar_code: 8003753937601,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas IES ILLY Tostatura Scura 100un',
                    description_short: 'Café Cápsulas IES ILLY Tostatura Scura 100un     Funcionam na Maquina Café Cápsulas Expresso Mitaca Cube ref: 6951078',
                    description_long: 'O sistema de cápsulas IES illycaffè (I-Espresso System) é uma colaboração entre a illy e mitaca para atender às necessidades atuais de escritórios. \n' +
                        '- As cápsulas embaladas individualmente em atmosfera protectora, contém a porção exacta de café para um espresso perfeito. \n' +
                        '- A parte inferior da cápsula é um sistema, inovador que permite a infusão de todo o café.',
                    id: 6600877,
                    image: 'http://www.netimagens.com/images/produtos/6600877.jpg',
                    min_sell: 1,
                    pvp_1: 26,
                    pvp_2: 0,
                    stock: 0,
                    weight: 1.55
                },
                {
                    id_category: 8,
                    bar_code: 8003753959849,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas MPS ILLY Descafeinado 15un',
                    description_short: 'Café Cápsulas MPS ILLY Descafeinado 15un',
                    description_long: 'Café 100% Arábica de qualidade superior.\n' +
                        'Caracteriza-se por um gosto equilibrado, exaltado por preciosas notas de caramelo, chocolate, pão torrado e delicadas nuances florais.\n' +
                        'Para utilização nas máquinas M4.',
                    id: 6601808,
                    image: 'http://www.netimagens.com/images/produtos/6601808_0.JPG',
                    min_sell: 1,
                    pvp_1: 3.69,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.16
                },
                {
                    id_category: 8,
                    bar_code: 8003753943459,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas MPS ILLY Longo 15un',
                    description_short: 'Café Cápsulas MPS ILLY Longo 15un',
                    description_long: 'Para quem prefere um café mais longo, sabor suave e delicado, com notas de flores, frutas e caramelo.\n' +
                        '\n' +
                        'Ideal para um copo de 90 ml.\n' +
                        'Teor de cafeína inferior a 1,5%.\n' +
                        '\n' +
                        'O novo formato MPS é a última geração de cápsulas desenvolvida pela Illy Café\n' +
                        '! Funciona exclusivamente com máquinas Mitaca Professional System',
                    id: 6601809,
                    image: 'http://www.netimagens.com/images/produtos/6601809_0.JPG',
                    min_sell: 1,
                    pvp_1: 4.55,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.15
                },
                {
                    id_category: 8,
                    bar_code: 8003753943473,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas MPS ILLY Tostatura Média 15un',
                    description_short: 'Café Cápsulas MPS ILLY Tostatura Média 15un',
                    description_long: 'Café 100% Arábica de qualidade superior.\n' +
                        'Caracteriza-se por um gosto equilibrado, exaltado por preciosas notas de caramelo, chocolate, pão torrado e delicadas nuances florais.\n' +
                        'Para utilização nas máquinas M4.',
                    id: 6601810,
                    image: 'http://www.netimagens.com/images/produtos/6601810_1.JPG',
                    min_sell: 1,
                    pvp_1: 3.69,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.15
                },
                {
                    id_category: 8,
                    bar_code: 8003753943497,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas MPS ILLY Tostatura Escura 15un',
                    description_short: 'Café Cápsulas MPS ILLY Tostatura Escura 15un',
                    description_long: 'Café 100% Arábica de qualidade superior.\n' +
                        'Caracteriza-se por um gosto equilibrado, exaltado por preciosas notas de caramelo, chocolate, pão torrado e delicadas nuances florais.\n' +
                        'Para utilização nas máquinas M4.',
                    id: 6601811,
                    image: 'http://www.netimagens.com/images/produtos/6601811_0.JPG',
                    min_sell: 1,
                    pvp_1: 3.69,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.15
                },
                {
                    id_category: 8,
                    bar_code: 8003753114347,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas ILLY IperEspresso Filtro Tosta Media Cx18un',
                    description_short: 'Café Cápsulas ILLY IperEspresso Filtro Tosta Media Cx18un "Tipo café Americano"',
                    description_long: '"Tipo café Americano"  Torra Média - Clássico. Faça um café tipo coado com a qualidade illy ao toque de um botão.\n' +
                        '\n' +
                        'Para um café equilibrado entre notas ácidas e amargas, de flores e frutas, caramelo, pão torrado, chocolate, toques de amêndoa e mel, que se unem numa sensação perfeita.\n' +
                        'Quantidade: Cada pacote contém 18 cápsulas.\n' +
                        '\n' +
                        'Sistema IperEspresso Illy\n' +
                        'O sistema IperEspresso Illy permite que prepare um café extraordinário em casa com facilidade e praticidade.\n' +
                        'Cada cápsula contém aproximadamente sete gramas de café arábica illy perfeitamente torrado e habilmente moído, 100% sustentável cultivado com um sabor suave, rico e encorpado.\n' +
                        'O resultado é um autêntico café italiano que é perfeitamente consistente, suave, equilibrado e nunca amargo.',
                    id: 6603291,
                    image: 'http://www.netimagens.com/images/produtos/6603291.JPG',
                    min_sell: 1,
                    pvp_1: 6.61,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.27
                },
                {
                    id_category: 8,
                    bar_code: 8003753943718,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas ILLY IperEspresso Guatemala Lata 21un',
                    description_short: 'Café Cápsulas ILLY IperEspresso Guatemala Lata 21un',
                    description_long: '',
                    id: 6607102,
                    image: 'http://www.netimagens.com/images/produtos/6607102.JPG',
                    min_sell: 1,
                    pvp_1: 7.71,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.47
                },
                {
                    id_category: 8,
                    bar_code: 8003753974811,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas ILLY IperEspresso Colômbia Lata 21un',
                    description_short: 'Café Cápsulas ILLY IperEspresso Colômbia Lata 21un',
                    description_long: '',
                    id: 6607103,
                    image: 'http://www.netimagens.com/images/produtos/6607103_350X350.JPG',
                    min_sell: 1,
                    pvp_1: 7.71,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0.47
                },
                {
                    id_category: 8,
                    bar_code: 8003753943695,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas ILLY IperEspresso Brasil Lata 21un',
                    description_short: 'Café Cápsulas ILLY IperEspresso Brasil Lata 21un',
                    description_long: '',
                    id: 6607105,
                    image: 'http://www.netimagens.com/images/produtos/6607105.JPG',
                    min_sell: 1,
                    pvp_1: 7.71,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.47
                },
                {
                    id_category: 8,
                    bar_code: 8003753943732,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas ILLY IperEspresso Etiópia Lata 21un',
                    description_short: 'Café Cápsulas ILLY IperEspresso Etiópia Lata 21un',
                    description_long: '',
                    id: 6607112,
                    image: 'http://www.netimagens.com/images/produtos/6607112.JPG',
                    min_sell: 1,
                    pvp_1: 7.71,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0.48
                },
                {
                    id_category: 8,
                    bar_code: 8003753919775,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas ILLY IperEspresso Torra Clássica Lata 21un',
                    description_short: 'Café Cápsulas ILLY IperEspresso Torra Clássica Lata 21un',
                    description_long: 'Um equilíbrio de força e suavidade.\n' +
                        'Com aromas de chocolate, pão, caramelo e flores.',
                    id: 6607463,
                    image: 'http://www.netimagens.com/images/produtos/6607463.JPG',
                    min_sell: 1,
                    pvp_1: 7.71,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.47
                },
                {
                    id_category: 8,
                    bar_code: 8003753919782,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas ILLY IperEspresso Torra Intensa Lata 21un',
                    description_short: 'Café Cápsulas ILLY IperEspresso Torra Intensa Lata 21un',
                    description_long: 'Um equilíbrio de força e suavidade.\n' +
                        'Com aromas de chocolate, pão, caramelo e flores.',
                    id: 6607464,
                    image: 'http://www.netimagens.com/images/produtos/6607464.JPG',
                    min_sell: 1,
                    pvp_1: 7.71,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.46
                },
                {
                    id_category: 8,
                    bar_code: 8003753919799,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas ILLY IperEspresso Descafeinado Lata 21un',
                    description_short: 'Café Cápsulas ILLY IperEspresso Descafeinado Lata 21un',
                    description_long: 'Um equilíbrio de força e suavidade.\n' +
                        'Com aromas de chocolate, pão, caramelo e flores.',
                    id: 6607465,
                    image: 'http://www.netimagens.com/images/produtos/6607465.JPG',
                    min_sell: 1,
                    pvp_1: 7.71,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.47
                },
                {
                    id_category: 8,
                    bar_code: 8003753967288,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café MonoCápsula ILLY IPERESPRESSO Tosta Média 100un',
                    description_short: 'Café MonoCápsula ILLY IPERESPRESSO Tosta Média 100un',
                    description_long: '',
                    id: 6607528,
                    image: 'http://www.netimagens.com/images/produtos/6607528.jpg',
                    min_sell: 1,
                    pvp_1: 36.72,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 2
                },
                {
                    id_category: 8,
                    bar_code: 8003753967301,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café MonoCápsula ILLY IPERESPRESSO Tosta Scura 100un',
                    description_short: 'Café MonoCápsula ILLY IPERESPRESSO Tosta Scura 100un',
                    description_long: '',
                    id: 6607529,
                    image: 'http://www.netimagens.com/images/produtos/6607529.jpg',
                    min_sell: 1,
                    pvp_1: 36.72,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 2.01
                },
                {
                    id_category: 8,
                    bar_code: 8003753967325,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café MonoCápsula ILLY IPERESPRESSO Descafeinado 100un',
                    description_short: 'Café MonoCápsula ILLY IPERESPRESSO Descafeinado 100un',
                    description_long: '',
                    id: 6607530,
                    image: 'http://www.netimagens.com/images/produtos/6607530.jpg',
                    min_sell: 1,
                    pvp_1: 36.72,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 1.53
                },
                {
                    id_category: 8,
                    bar_code: 8003753940564,
                    brand: 'ILLY',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas IES ILLY Descafeinado 50un',
                    description_short: 'Café Cápsulas IES ILLY Descafeinado 50un                        Funcionam na Maquina Café Cápsulas Expresso Mitaca Cube ref:6951078',
                    description_long: 'O sistema de cápsulas IES illycaffè (I-Espresso System) é uma colaboração entre a illy e mitaca para atender às necessidades atuais de escritórios.\n' +
                        'As cápsulas embaladas individualmente em atmosfera protectora, contém a porção exacta de café para um espresso perfeito. \n' +
                        'A parte inferior da cápsula é um sistema, inovador que permite a infusão de todo o café. \n' +
                        'Funcionam na Maquina Café Cápsulas Expresso Mitaca Cube ref:6951078',
                    id: 660996,
                    image: 'http://www.netimagens.com/images/produtos/660996_0.JPG',
                    min_sell: 1,
                    pvp_1: 13,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.8
                },
                {
                    id_category: 8,
                    bar_code: 5608011033618,
                    brand: 'MITACA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas IES Mitaca Café e Ginseng 50un',
                    description_short: 'Café Cápsulas IES Mitaca Café e Ginseng 50un',
                    description_long: 'As propriedades tônicas de ginseng mais o poder energizante do café. \n' +
                        'Uma infusão que revitaliza.',
                    id: 6600860,
                    image: 'http://www.netimagens.com/images/produtos/6600860.jpg',
                    min_sell: 1,
                    pvp_1: 8.6,
                    pvp_2: 8.08,
                    stock: '11--100',
                    weight: 0.84
                },
                {
                    id_category: 8,
                    bar_code: 8058450960254,
                    brand: 'MITACA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas IES Mitaca Forte 100un',
                    description_short: 'Café Cápsulas IES Mitaca Forte 100un |                    50% Arábica / Robusta',
                    description_long: 'Uma bela mistura de Arábica e Robusta, que \n' +
                        'proporciona um aroma forte.\n' +
                        'Sem açucar\n' +
                        '50% Arábica / Robusta',
                    id: 6600884,
                    image: 'http://www.netimagens.com/images/produtos/6600884_0.JPG',
                    min_sell: 1,
                    pvp_1: 15.88,
                    pvp_2: 0,
                    stock: '101--1000',
                    weight: 1.5
                },
                {
                    id_category: 8,
                    bar_code: 8058450960261,
                    brand: 'MITACA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas IES Mitaca Supremo 100un',
                    description_short: 'Café Cápsulas IES Mitaca Supremo 100un',
                    description_long: 'Contém uma mistura preciosa de 100% arábica. \n' +
                        'Sabor delicado com notas de avelã.\n' +
                        'Sem açucar',
                    id: 6600885,
                    image: 'http://www.netimagens.com/images/produtos/6600885.jpg',
                    min_sell: 1,
                    pvp_1: 17.25,
                    pvp_2: 0,
                    stock: '101--1000',
                    weight: 1.5
                },
                {
                    id_category: 8,
                    bar_code: 5608011033601,
                    brand: 'MITACA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas IES Mitaca Cevada 50un',
                    description_short: 'Café Cápsulas IES Mitaca Cevada 50un',
                    description_long: 'Concentração de Cevada. Com propriedades curativas é conhecido pelo sabor genuíno e agradável.',
                    id: 6600890,
                    image: 'http://www.netimagens.com/images/produtos/6600890.jpg',
                    min_sell: 1,
                    pvp_1: 8.6,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.54
                },
                {
                    id_category: 8,
                    bar_code: 8058450960278,
                    brand: 'MITACA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas IES Mitaca Descafeinado 50un',
                    description_short: 'Café Cápsulas IES Mitaca Descafeinado 50un',
                    description_long: 'Mistura de 100% arábica com o aroma do melhor \n' +
                        'café expresso e teores de cafeína abaixo de 0,1%.',
                    id: 6600916,
                    image: 'http://www.netimagens.com/images/produtos/6600916_0.JPG',
                    min_sell: 1,
                    pvp_1: 8.84,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.8
                },
                {
                    id_category: 8,
                    bar_code: 8003753184555,
                    brand: 'MITACA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas MPS Mitaca Café e Ginseng 25un',
                    description_short: 'Café Cápsulas MPS Mitaca Café e Ginseng 25un',
                    description_long: 'Às propriedades tónicas do ginseng junta-se o poder energizante do café.\n' +
                        'Uma infusão que restaura vitalidade e energia.\n' +
                        '\n' +
                        'O novo formato MPS é a última geração de cápsulas desenvolvida pela Illy Café\n' +
                        '! Funciona exclusivamente com máquinas Mitaca Professional System',
                    id: '660I0002989',
                    image: 'http://www.netimagens.com/images/produtos/660I0002989.JPG',
                    min_sell: 1,
                    pvp_1: 5,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.27
                },
                {
                    id_category: 8,
                    bar_code: 8058450960001,
                    brand: 'MITACA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas MPS Mitaca Forte 15un',
                    description_short: 'Café Cápsulas MPS Mitaca Forte 15un',
                    description_long: 'Um blend de Arábica para suavidade e delicadeza e Robusta para aromas fortes são encontrados nas cápsulas MPS-MITACA FORTE.\n' +
                        '\n' +
                        'Origens: Arábica do Brasil e América Central e Robusta do Sudeste Asiático\n' +
                        'Sabores e Notas: Equilibrado e gourmet\n' +
                        'Encorpado com caráter (força 8)\n' +
                        'Ideal para um café de 30ml\n' +
                        '\n' +
                        '! Funciona exclusivamente com máquinas Mitaca Professional System',
                    id: '660I0003114',
                    image: 'http://www.netimagens.com/images/produtos/660I0003114.JFIF',
                    min_sell: 1,
                    pvp_1: 2.78,
                    pvp_2: 0,
                    stock: '101--1000',
                    weight: 0.15
                },
                {
                    id_category: 8,
                    bar_code: 8058450960018,
                    brand: 'MITACA',
                    category: 'Cafe Capsulas',
                    description: 'Café Cápsulas MPS Mitaca Supremo 15un',
                    description_short: 'Café Cápsulas MPS Mitaca Supremo 15un',
                    description_long: 'Um blend 100% Arábica selecionado nas melhores áreas de produção da América do Sul para obter nesta cápsula MPS SUPREMO a extração de um Espresso de qualidade superior.\n' +
                        '\n' +
                        'Origens: América Central\n' +
                        'Sabores e Notas: Round Gourmet\n' +
                        'Equilibrado (Força 4 a 6)\n' +
                        'Ideal para um café de 30ml\n' +
                        '\n' +
                        '! Funciona exclusivamente com máquinas Mitaca Professional System',
                    id: '660I0003117',
                    image: 'http://www.netimagens.com/images/produtos/660I0003117.JPG',
                    min_sell: 1,
                    pvp_1: 3.07,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.16
                },
                {
                    id_category: 9,
                    bar_code: 5601061040858543,
                    brand: 'BOGANI',
                    category: 'Cafe Grao',
                    description: 'Cafe Grao Bogani 1000gr',
                    description_short: 'Cafe Grao Bogani 1000gr',
                    description_long: '',
                    id: 6601005,
                    image: 'http://www.netimagens.com/images/produtos/6601005.jpg',
                    min_sell: 1,
                    pvp_1: 7.5,
                    pvp_2: 0,
                    stock: 0,
                    weight: 1.02
                },
                {
                    id_category: 9,
                    bar_code: 5600319740014,
                    brand: 'COFFEESPOT',
                    category: 'Cafe Grao',
                    description: 'Café Grão CoffeeSpot Lote Roma 1000gr',
                    description_short: 'Café Grão CoffeeSpot Lote Roma 1000gr',
                    description_long: 'A junção de arábica e robusta que lhe dá um sabor intenso. Ideal para utilização em empresas de média e grande dimensão.\n' +
                        'Composição: 25% Arábica 75% Robusta',
                    id: 6601004,
                    image: 'http://www.netimagens.com/images/produtos/6601004_0.JPG',
                    min_sell: 1,
                    pvp_1: 7.4,
                    pvp_2: 6.5,
                    stock: '11--100',
                    weight: 1.03
                },
                {
                    id_category: 9,
                    bar_code: 5608011113839,
                    brand: 'COFFEESPOT',
                    category: 'Cafe Grao',
                    description: 'Café Grão CoffeeSpot Lote Milano 1000gr',
                    description_short: 'Café Grão CoffeeSpot Lote Milano 1000gr',
                    description_long: '',
                    id: 6601006,
                    image: 'http://www.netimagens.com/images/produtos/6601006_0.JPG',
                    min_sell: 1,
                    pvp_1: 7,
                    pvp_2: 6,
                    stock: '11--100',
                    weight: 1.03
                },
                {
                    id_category: 9,
                    bar_code: 8003753900520,
                    brand: 'ILLY',
                    category: 'Cafe Grao',
                    description: 'Café Grão ILLY Tostatura Média Lata 250gr',
                    description_short: 'Café Grão ILLY Tostatura Média Lata 250gr',
                    description_long: 'Um creme denso de cor avelã com estrias castanho-escuras que proporciona um aroma completo, com notas de chocolate, pão torrado, mel e caramelo.\n' +
                        'O sabor com corpo é aveludado e doce e apresenta um toque amargo que desaparece depois de alguns minutos.',
                    id: 660469,
                    image: 'http://www.netimagens.com/images/produtos/660469.JPG',
                    min_sell: 1,
                    pvp_1: 6.97,
                    pvp_2: 6.4,
                    stock: '11--100',
                    weight: 0.39
                },
                {
                    id_category: 9,
                    bar_code: 8003753970042,
                    brand: 'ILLY',
                    category: 'Cafe Grao',
                    description: 'Café Grão ILLY Arábica Seleção Brasil Lata 250gr',
                    description_short: 'Café Grão ILLY Arábica Seleção Brasil Lata 250gr',
                    description_long: '',
                    id: 6607095,
                    image: 'http://www.netimagens.com/images/produtos/6607095.JPG',
                    min_sell: 1,
                    pvp_1: 6.97,
                    pvp_2: 6.4,
                    stock: 0,
                    weight: 0.39
                },
                {
                    id_category: 9,
                    bar_code: 8003753104904,
                    brand: 'ILLY',
                    category: 'Cafe Grao',
                    description: 'Café Grão ILLY Arábica Seleção Colômbia Lata 250gr',
                    description_short: 'Café Grão ILLY Arábica Seleção Colômbia Lata 250gr',
                    description_long: '',
                    id: 6607098,
                    image: 'http://www.netimagens.com/images/produtos/6607098.JPG',
                    min_sell: 1,
                    pvp_1: 6.97,
                    pvp_2: 6.4,
                    stock: '1--10',
                    weight: 0.39
                },
                {
                    id_category: 9,
                    bar_code: 8003753918198,
                    brand: 'ILLY',
                    category: 'Cafe Grao',
                    description: 'Café Grão ILLY Tostatura Scura Lata 250gr',
                    description_short: 'Café Grão ILLY Tostatura Scura Lata 250gr',
                    description_long: 'Um creme denso de cor avelã com estrias castanho-escuras que proporciona um aroma completo, com notas de chocolate, pão torrado, mel e caramelo. \n' +
                        'O sabor com corpo é aveludado e doce e apresenta um toque amargo que desaparece depois de alguns minutos.',
                    id: 6607723,
                    image: 'http://www.netimagens.com/images/produtos/6607723.JPG',
                    min_sell: 1,
                    pvp_1: 6.97,
                    pvp_2: 6.4,
                    stock: '11--100',
                    weight: 0.39
                },
                {
                    id_category: 10,
                    bar_code: 8003753900490,
                    brand: 'ILLY',
                    category: 'Cafe Moido',
                    description: 'Café Moido ILLY Descafeinado Lata 250gr',
                    description_short: 'Café Moido ILLY Descafeinado Lata 250gr',
                    description_long: 'Um creme denso de cor avelã com estrias castanho-escuras que proporciona um aroma completo, com notas de chocolate, pão torrado, mel e caramelo.\n' +
                        'Com corpo aveludado e doce, apresenta um toque amargo que desaparece depois de alguns minutos.',
                    id: 660467,
                    image: 'http://www.netimagens.com/images/produtos/660467.jpg',
                    min_sell: 1,
                    pvp_1: 6.97,
                    pvp_2: 6.4,
                    stock: '11--100',
                    weight: 0.39
                },
                {
                    id_category: 10,
                    bar_code: ' ',
                    brand: 'ILLY',
                    category: 'Cafe Moido',
                    description: 'Café Moido ILLY Tostatura Scura Lata 125gr',
                    description_short: 'Café Moido ILLY Tostatura Scura Lata 125gr',
                    description_long: '',
                    id: 660474,
                    image: 'http://www.netimagens.com/images/produtos/660474.jpg',
                    min_sell: 1,
                    pvp_1: 2.94,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0
                },
                {
                    id_category: 10,
                    bar_code: ' ',
                    brand: 'ILLY',
                    category: 'Cafe Moido',
                    description: 'Café Moido ILLY Descafeinado Lata 125gr',
                    description_short: 'Café Moido ILLY Descafeinado Lata 125gr',
                    description_long: '',
                    id: 660475,
                    image: 'http://www.netimagens.com/images/produtos/660475.jpg',
                    min_sell: 1,
                    pvp_1: 2.94,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0
                },
                {
                    id_category: 10,
                    bar_code: 8003753900438,
                    brand: 'ILLY',
                    category: 'Cafe Moido',
                    description: 'Café Moído ILLY Tostatura Média Lata 250gr',
                    description_short: 'Café Moído ILLY Tostatura Média Lata 250gr',
                    description_long: 'Um creme denso de cor avelã com estrias castanho-escuras que proporciona um aroma completo, com notas de chocolate, pão torrado, mel e caramelo.\n' +
                        'Com corpo aveludado e doce, apresenta um toque amargo que desaparece depois de alguns minutos.',
                    id: 660756,
                    image: 'http://www.netimagens.com/images/produtos/660756.jpg',
                    min_sell: 1,
                    pvp_1: 6.97,
                    pvp_2: 6.4,
                    stock: '11--100',
                    weight: 0.39
                },
                {
                    id_category: 10,
                    bar_code: 8003753900469,
                    brand: 'ILLY',
                    category: 'Cafe Moido',
                    description: 'Café Moido ILLY Tostatura Scura Lata 250gr',
                    description_short: 'Café Moido ILLY Tostatura Scura Lata 250gr          (0465)',
                    description_long: 'Um creme denso de cor avelã com estrias castanho-escuras que proporciona um aroma completo, com notas de chocolate, pão torrado, mel e caramelo.\n' +
                        'Com corpo aveludado e doce, apresenta um toque amargo que desaparece depois de alguns minutos.',
                    id: 660758,
                    image: 'http://www.netimagens.com/images/produtos/660758.jpg',
                    min_sell: 1,
                    pvp_1: 6.97,
                    pvp_2: 6.4,
                    stock: '11--100',
                    weight: 0.39
                },
                {
                    id_category: 11,
                    bar_code: 5600393530648,
                    brand: 'CAFFIER',
                    category: 'Cafe Pastilhas',
                    description: 'Café Pastilhas Caffier Aventura 150un',
                    description_short: 'Café Pastilhas Caffier Aventura 150un',
                    description_long: '',
                    id: 6591337,
                    image: 'http://www.netimagens.com/images/produtos/6591337_0.JPG',
                    min_sell: 1,
                    pvp_1: 15.9,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 1.5
                },
                {
                    id_category: 11,
                    bar_code: 5600393530631,
                    brand: 'CAFFIER',
                    category: 'Cafe Pastilhas',
                    description: 'Café Pastilhas Caffier Vera Cruz 150un',
                    description_short: 'Café Pastilhas Caffier Vera Cruz 150un',
                    description_long: '',
                    id: 6591338,
                    image: 'http://www.netimagens.com/images/produtos/6591338_0.JPG',
                    min_sell: 1,
                    pvp_1: 15.9,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 1.46
                },
                {
                    id_category: 11,
                    bar_code: 5600393530662,
                    brand: 'COFFEETHERAPY',
                    category: 'Cafe Pastilhas',
                    description: 'Café Pastilhas Descafeinado Cruz 50un',
                    description_short: 'Café Pastilhas Descafeinado Cruz 50un',
                    description_long: '',
                    id: 6591339,
                    image: 'http://www.netimagens.com/images/produtos/6591339_0.JPG',
                    min_sell: 1,
                    pvp_1: 5.35,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.5
                },
                {
                    id_category: 11,
                    bar_code: 8003753918242,
                    brand: 'ILLY',
                    category: 'Cafe Pastilhas',
                    description: 'Café Pastilhas ILLY Tostatura Média 18un',
                    description_short: 'Café Pastilhas Individuais ILLY Tostatura Média 18 unidades',
                    description_long: 'E.S.E. (Easy Serving Espresso) foi o primeiro sistema no mundo a conseguir de forma fácil um espresso perfeito utilizando porções individuais de café, embaladas na dose exata e com uma pressão correta de moagem. \n' +
                        'Cada dose individual contém uma porção do blend illy feito de nove variedades de puro café Arábica, seleccionados entre os melhores do mundo.',
                    id: 6607737,
                    image: 'http://www.netimagens.com/images/produtos/6607737_0.JPG',
                    min_sell: 1,
                    pvp_1: 4.52,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.21
                },
                {
                    id_category: 11,
                    bar_code: 8003753918266,
                    brand: 'ILLY',
                    category: 'Cafe Pastilhas',
                    description: 'Café Pastilhas ILLY Descafeinado 18un',
                    description_short: 'Café Pastilhas Individuais ILLY Descafeinado 18 unidades (7759)',
                    description_long: 'E.S.E. (Easy Serving Espresso) foi o primeiro sistema no mundo a conseguir de forma fácil um espresso perfeito utilizando porções individuais de café, embaladas na dose exata e com uma pressão correta de moagem.\n' +
                        'Cada dose individual contém uma porção do blend illy feito de nove variedades de puro café Arábica, seleccionados entre os melhores do mundo.',
                    id: 6607738,
                    image: 'http://www.netimagens.com/images/produtos/6607738_0.JPG',
                    min_sell: 1,
                    pvp_1: 4.52,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.22
                },
                {
                    id_category: 11,
                    bar_code: 8003753918259,
                    brand: 'ILLY',
                    category: 'Cafe Pastilhas',
                    description: 'Café Pastilhas ILLY Tostatura Scura 18un',
                    description_short: 'Café Pastilhas Individuais ILLY Tostatura Scura 18 unidades',
                    description_long: 'E.S.E. (Easy Serving Espresso) foi o primeiro sistema no mundo a conseguir de forma fácil um espresso perfeito utilizando porções individuais de café, embaladas na dose exata e com uma pressão correta de moagem. \n' +
                        'Cada dose individual contém uma porção do blend illy feito de nove variedades de puro café Arábica, seleccionados entre os melhores do mundo.',
                    id: 6607739,
                    image: 'http://www.netimagens.com/images/produtos/6607739.jpg',
                    min_sell: 1,
                    pvp_1: 4.52,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.21
                },
                {
                    id_category: 11,
                    bar_code: 8003753180151,
                    brand: 'ILLY',
                    category: 'Cafe Pastilhas',
                    description: 'Café Pastilhas ILLY Classico Lungo 18un',
                    description_short: 'Café Pastilhas Individuais ILLY Classico Lungo 18un',
                    description_long: '',
                    id: 6609976,
                    image: 'http://www.netimagens.com/images/produtos/6609976_0.JPG',
                    min_sell: 1,
                    pvp_1: 4.52,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0.2
                },
                {
                    id_category: 12,
                    bar_code: 8000265320452,
                    brand: 'ILLY',
                    category: 'Cafe Soluvel',
                    description: 'Café Solúvel ILLY Saquetas 2gr 300un',
                    description_short: 'Café Solúvel ILLY Saquetas 2gr 300un',
                    description_long: '',
                    id: 66020452,
                    image: 'http://www.netimagens.com/images/produtos/66020452_0.JPG',
                    min_sell: 1,
                    pvp_1: 72.73,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0.94
                },
                {
                    id_category: 12,
                    bar_code: 8003753144313,
                    brand: 'ILLY',
                    category: 'Cafe Soluvel',
                    description: 'Café Solúvel ILLY 95gr Tostatura Scura 1un',
                    description_short: 'Café Solúvel ILLY 95gr Tostatura Scura 1un     = 5,89 Litros Café',
                    description_long: 'O sabor INTENSO do blend único illy 100% Arábica expressa um leve amargor e produz um café de corpo poderoso, caracterizado por notas de cacau e frutas secas. Para os amantes de um café saboroso e encorpado.',
                    id: 66022474,
                    image: 'http://www.netimagens.com/images/produtos/66022474_1.JPG',
                    min_sell: 6,
                    pvp_1: 6.73,
                    pvp_2: 6.45,
                    stock: '1--10',
                    weight: 0.16
                },
                {
                    id_category: 12,
                    bar_code: 5608011048322,
                    brand: 'ILLY',
                    category: 'Cafe Soluvel',
                    description: 'Café Solúvel ILLY 16grx1un=1 Litro Café',
                    description_short: 'Café Solúvel ILLY 16grx1un=1 Litro Café',
                    description_long: 'Deve ser preparado para consumo com a adição de água filtrada, preferencialmente quente e não fervente.\n' +
                        'As vantagens do café solúvel são a velocidade de preparo e praticidade, já que não é necessário filtrar o café, é só adicionar água quente e está pronto.',
                    id: '660B1550',
                    image: 'http://www.netimagens.com/images/produtos/660B1550.jpg',
                    min_sell: 25,
                    pvp_1: 1.39,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.02
                },
                {
                    id_category: 12,
                    bar_code: 8003753971656,
                    brand: 'ILLY',
                    category: 'Cafe Soluvel',
                    description: 'Café Solúvel ILLY 500gr 1un',
                    description_short: 'Café Solúvel ILLY 500gr 1un = 31 Litros Café',
                    description_long: '',
                    id: '660B1656',
                    image: 'http://www.netimagens.com/images/produtos/660B1656_0.JPG',
                    min_sell: 1,
                    pvp_1: 35.52,
                    pvp_2: 0,
                    stock: 0,
                    weight: 0.5
                },
                {
                    id_category: 13,
                    bar_code: 5600356501706,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco a Granel Blanc d Oranger 250g',
                    description_short: 'Chá Branco a Granel Blanc d Oranger 250g',
                    description_long: 'A frescura delicada e floral dos rebentos de chá branco combinada com os sabores quentes e redondos do néroli e da flor de laranjeira. Um chá delicado e sutilmente perfumado: um convite à calma e à serenidade.\n' +
                        '\n' +
                        'Nota dominante: frutas cítricas\n' +
                        'Nota (s) secundária (s): notas florais\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: Neroli\n' +
                        '\n' +
                        'Infusão 4/6 min\n' +
                        'Temperatura 80 ° C / 176 ° F',
                    id: 65901706,
                    image: 'http://www.netimagens.com/images/produtos/65901706.jpg',
                    min_sell: 1,
                    pvp_1: 16.92,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.28
                },
                {
                    id_category: 13,
                    bar_code: 560035659278,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco a Granel Pechers en Fleurs 250g',
                    description_short: 'Chá Branco a Granel Pechers en Fleurs 250g',
                    description_long: 'O delicado perfume das flores de pêssego combina-se deliciosamente com a frescura herbácea de um chá branco. As notas naturalmente frutadas deste chá branco que lembram os damascos se combinam com o sabor das flores de pêssego para criar uma mistura refrescante com um licor leve e sutilmente frutado.\n' +
                        '\n' +
                        'Nota dominante: notas florais\n' +
                        'Nota (s) secundária (s): frutas do pomar\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: flor de pêssego\n' +
                        '\n' +
                        'Infusão 4/6 min\n' +
                        'Temperatura 80 ° C / 176 ° F',
                    id: 659278,
                    image: 'http://www.netimagens.com/images/produtos/659278.jpg',
                    min_sell: 1,
                    pvp_1: 16.11,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.28
                },
                {
                    id_category: 13,
                    bar_code: 560801103056,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco a Granel Jasmin Yin Zhen 500g',
                    description_short: 'Chá Branco a Granel Jasmin Yin Zhen 500g',
                    description_long: 'Aqui, as folhas pontiagudas prateadas cobertas por uma penugem macia e espessa, como pele, estão impregnadas de um perfume suave de jasmim fresco. Este chá raro e requintado combina a delicadeza de um chá branco de alta qualidade com o aroma doce e floral da flor. Indispensável para quem adora chás de jasmim.\n' +
                        '\n' +
                        'Nota dominante: Simples\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        '\n' +
                        'Infusão 4/5 min\n' +
                        'Temperatura 70/80 ° C / 167/176 ° F\n' +
                        'Recomendado Chá Gelado',
                    id: 6593056,
                    image: 'http://www.netimagens.com/images/produtos/6593056.jpg',
                    min_sell: 1,
                    pvp_1: 108.04,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.5
                },
                {
                    id_category: 13,
                    bar_code: 5600356593455,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco a Granel Passion De Fleurs 250g',
                    description_short: 'Chá Branco a Granel Passion De Fleurs 250g',
                    description_long: 'A delicadeza deste chá branco combina-se com o subtil aroma da rosa e os sabores frutados do damasco e do maracujá. Uma mistura deliciosamente equilibrada para uma chávena de chá fresco e vegetal.\n' +
                        '\n' +
                        'Nota dominante: notas florais\n' +
                        'Nota (s) secundária (s): frutas do pomar\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: Rosa\n' +
                        'Sabor (es) complementar (es): Damasco, Maracujá\n' +
                        '\n' +
                        'Infusão 4/6 min\n' +
                        'Temperatura 80 ° C / 176 ° F\n' +
                        'Recomendado Chá Gelado',
                    id: 6593455,
                    image: 'http://www.netimagens.com/images/produtos/6593455.jpg',
                    min_sell: 1,
                    pvp_1: 15.99,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.28
                },
                {
                    id_category: 13,
                    bar_code: 5608011115390,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco a Granel Passion De Fleurs 500g',
                    description_short: 'Chá Branco a Granel Passion De Fleurs 500g',
                    description_long: 'A delicadeza deste chá branco se mistura com o sutil sabor da rosa e os sabores frutados do damasco e do maracujá. \n' +
                        'Uma mistura deliciosamente equilibrada para uma chávena de chá fresco e vegetal. \n' +
                        '\n' +
                        'Nota dominante: notas florais\n' +
                        'Nota (s) secundária (s): frutas do pomar\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: Rosa\n' +
                        'Sabor (es) complementar (es): Damasco, Maracujá\n' +
                        '\n' +
                        'Infusão: 4/6 min\n' +
                        'Temperatura: 80 ° C / 176 ° F\n' +
                        'Recomendado: chá gelado',
                    id: '6593455BIS',
                    image: 'http://www.netimagens.com/images/produtos/6593455.jpg',
                    min_sell: 1,
                    pvp_1: 32.16,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.53
                },
                {
                    id_category: 13,
                    bar_code: 5600356593668,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco a Granel Great Earl Grey 250g',
                    description_short: 'Chá Branco a Granel Great Earl Grey 250g',
                    description_long: 'Este chá combina as notas frutadas e levemente herbáceas do chá branco com o frutado vivo e franco da bergamota calabresa. Força e delicadeza contrastam e se complementam nesta mistura deliciosamente perfumada.\n' +
                        '\n' +
                        'Nota dominante: frutas cítricas\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: Bergamota\n' +
                        '\n' +
                        'Infusão 4/6 min\n' +
                        'Temperatura 80 ° C / 176 ° F',
                    id: 6593668,
                    image: 'http://www.netimagens.com/images/produtos/6593668.jpg',
                    min_sell: 1,
                    pvp_1: 14.15,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.28
                },
                {
                    id_category: 13,
                    bar_code: 5600356593751,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco a Granel Bali Blanc 250g',
                    description_short: 'Chá Branco a Granel Bali Blanc 250g',
                    description_long: 'A frescura herbácea do chá branco e a nota florida do chá verde de jasmim misturam-se com aromas deliciosamente frutados de lichia, toranja, pêssego videira e um toque de rosa.\n' +
                        '\n' +
                        'Nota dominante: frutas exóticas\n' +
                        'Nota (s) secundária (s): notas florais\n' +
                        'Tipo (s) de infusão (ões): chá branco, chá verde\n' +
                        'Sabor principal: Lichia\n' +
                        'Sabor (es) complementar (is): toranja, pêssego, rosa, jasmim\n' +
                        '\n' +
                        'Infusão: 4/6 min\n' +
                        'Temperatura: 80 ° C',
                    id: 6593751,
                    image: 'http://www.netimagens.com/images/produtos/6593751.jpg',
                    min_sell: 1,
                    pvp_1: 40.15,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.28
                },
                {
                    id_category: 13,
                    bar_code: 3259920052157,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco em Bolsas Passion de Fleurs 25un',
                    description_short: 'Chá Branco em Bolsas Passion de Fleurs 25un',
                    description_long: 'A delicadeza deste chá branco se mistura com o sutil sabor da rosa e os sabores frutados do damasco e do maracujá. \n' +
                        'Uma mistura deliciosamente equilibrada para uma chávena de chá fresco e vegetal. \n' +
                        '\n' +
                        'Nota dominante: notas florais\n' +
                        'Nota (s) secundária (s): frutas do pomar\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: Rosa\n' +
                        'Sabor (es) complementar (es): Damasco, Maracujá\n' +
                        '\n' +
                        'Infusão: 4/6 min\n' +
                        'Temperatura: 80 ° C / 176 ° F\n' +
                        'Recomendado: chá gelado',
                    id: 6595215,
                    image: 'http://www.netimagens.com/images/produtos/6595215.0.JPG',
                    min_sell: 1,
                    pvp_1: 7.05,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.08
                },
                {
                    id_category: 13,
                    bar_code: 560035659902,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco a Granel Christmas Tea Blanc 250g',
                    description_short: 'Chá Branco a Granel Christmas Tea Blanc 250g',
                    description_long: 'Os finos rebentos do chá branco combinam-se delicadamente com as pétalas frágeis, assumindo notas frutadas elevadas por um toque de amêndoa e gengibre. Este chá único irá revitalizar o tradicional Natal branco.\n' +
                        '\n' +
                        'Nota dominante: Picante / Amadeirado\n' +
                        'Nota (s) secundária (s): Notas gourmet\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: Gengibre\n' +
                        'Sabor (es) complementar (es): Pão de Mel, Amêndoa, Cereja\n' +
                        '\n' +
                        'Infusão 4/6 min\n' +
                        'Temperatura 90 ° C / 194 ° F',
                    id: 659902,
                    image: 'http://www.netimagens.com/images/produtos/659902.jpg',
                    min_sell: 1,
                    pvp_1: 13.69,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.28
                },
                {
                    id_category: 13,
                    bar_code: 3259920049447,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco em Bolsas Passion de Fleurs 24un',
                    description_short: 'Chá Branco em Bolsas Passion de Fleurs 24un',
                    description_long: 'A delicadeza deste chá branco se mistura com o sutil sabor da rosa e os sabores frutados do damasco e do maracujá. \n' +
                        'Uma mistura deliciosamente equilibrada para uma chávena de chá fresco e vegetal. \n' +
                        '\n' +
                        'Nota dominante: notas florais\n' +
                        'Nota (s) secundária (s): frutas do pomar\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: Rosa\n' +
                        'Sabor (es) complementar (es): Damasco, Maracujá\n' +
                        '\n' +
                        'Infusão: 4/6 min\n' +
                        'Temperatura: 80 ° C / 176 ° F\n' +
                        'Recomendado: chá gelado',
                    id: '659NDH4944',
                    image: 'http://www.netimagens.com/images/produtos/659NDH4944.1.JPG',
                    min_sell: 1,
                    pvp_1: 8.6,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.1
                },
                {
                    id_category: 13,
                    bar_code: 3259920067656,
                    brand: 'DAMMANN FRÈRES',
                    category: 'Cha Branco',
                    description: 'Chá Branco em Lata Passion de Fleurs Nº20 60g',
                    description_short: 'Chá Branco em Lata Passion de Fleurs Nº20 60g',
                    description_long: 'A delicadeza deste chá branco se mistura com o sutil sabor da rosa e os sabores frutados do damasco e do maracujá. \n' +
                        'Uma mistura deliciosamente equilibrada para uma chávena de chá fresco e vegetal. \n' +
                        '\n' +
                        'Nota dominante: notas florais\n' +
                        'Nota (s) secundária (s): frutas do pomar\n' +
                        'Tipo (s) de chá: chá branco\n' +
                        'Sabor principal: Rosa\n' +
                        'Sabor (es) complementar (es): Damasco, Maracujá\n' +
                        '\n' +
                        'Infusão: 4/6 min\n' +
                        'Temperatura: 80 ° C / 176 ° F\n' +
                        'Recomendado: chá gelado',
                    id: '659NDR6765',
                    image: 'http://www.netimagens.com/images/produtos/659NDR6765_0.JPG',
                    min_sell: 1,
                    pvp_1: 6.8,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.14
                },
                {
                    id_category: 14,
                    bar_code: 8435336216108,
                    brand: 'BOGANI',
                    category: 'Cha Capsulas',
                    description: 'Chá Verde em Cápsulas Marrakech DG 16un',
                    description_short: 'Chá Verde em Cápsulas Marrakech Origen Sensations (Dolce Gusto) Cx.16*4g',
                    description_long: 'Compativel com a marca Dolce Gusto\n' +
                        'Folhas de chá verde (74%), folhas de hortelã-verde (20%), aroma de limão, extrato de chá verde granulado',
                    id: 6591319,
                    image: 'http://www.netimagens.com/images/produtos/6591319.JPG',
                    min_sell: 1,
                    pvp_1: 2.76,
                    pvp_2: 0,
                    stock: '11--100',
                    weight: 0.21
                },
                {
                    id_category: 14,
                    bar_code: 5608011033571,
                    brand: 'MITACA',
                    category: 'Cha Capsulas',
                    description: 'Chá Limão em Cápsulas IES Mitaca 50un',
                    description_short: 'Chá Limão em Cápsulas IES Mitaca 50un',
                    description_long: 'Bebida refrescante, perfeito para o pequeno-almoço ou para uma pausa relaxante.',
                    id: 6590887,
                    image: 'http://www.netimagens.com/images/produtos/6590887.jpg',
                    min_sell: 1,
                    pvp_1: 8.3,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.96
                },
                {
                    id_category: 14,
                    bar_code: 5608011033588,
                    brand: 'MITACA',
                    category: 'Cha Capsulas',
                    description: 'Chá Preto em Cápsulas IES Mitaca 50un',
                    description_short: 'Chá Preto em Cápsulas IES Mitaca 50un',
                    description_long: 'O chá preto é conhecido pelas suas propriedades \n' +
                        'estimulantes benéficas e revigorantes.',
                    id: 6590888,
                    image: 'http://www.netimagens.com/images/produtos/6590888.jpg',
                    min_sell: 1,
                    pvp_1: 8.3,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.54
                },
                {
                    id_category: 14,
                    bar_code: 5608011103343,
                    brand: 'MITACA',
                    category: 'Cha Capsulas',
                    description: 'Chá Verde em Cápsulas IES Mitaca 50un',
                    description_short: 'Chá Verde em Cápsulas IES Mitaca 50un',
                    description_long: 'Diversos tipos de chás em cápsulas. Ideal para relaxar ou simplesmente para um pausa no trabalho.\n' +
                        '\n' +
                        'Um dos chás mais consumidos no oriente, conhecido pelas suas qualidades calmantes e refrescantes.',
                    id: 6590889,
                    image: 'http://www.netimagens.com/images/produtos/6590889.jpg',
                    min_sell: 1,
                    pvp_1: 8.3,
                    pvp_2: 0,
                    stock: '1--10',
                    weight: 0.53
                },
            ]
        }
        process.stdout.write(`${BarColors.magenta('[WooCommerce]')} Connecting... `);
        this._WooCommerce = new WooCommerceRestApi({
            url: config.url,
            consumerKey: config.consumerKey,
            consumerSecret: config.consumerSecret,
            version: config.version
        });
        this._universalDataFormat = array;
        console.log(`${BarColors.magenta('Done')}`);
    }

    /**
     * insertCategories - Funtion that will check the categories, if they already exist or not, and then insert isto WooCommerce
     * @param array
     * @private
     */
    async #insertCategories(array: UniversalDataFormatCategories[]) {
        return new Promise(async (resolve, reject) => {
            const progressBar = new SingleBar({
                barsize: 25,
                format: `${BarColors.magenta('[WooCommerce]')} Inserting categories      |${BarColors.magenta('{bar}')}| {percentage}% | {value}/{total} Items`
            }, Presets.shades_classic);

            progressBar.start(array.length, 0);

            for (const element of array) {
                const index = array.indexOf(element);
                if (array[index].parent === 0) {
                    let newID = await this.#insertCategoryIntoWooCommerce(array[index])
                    const res: categoryIndexArray = {
                        originalID: array[index].id.toString(),
                        woocommerceID: newID.toString(),
                    }
                    this._allCategories.push(res)
                    progressBar.increment(1)
                }

            }

            progressBar.stop();
        });
    }

    /**
     * insertIntoWooCommerce - Funtion to insert the category into WooCommerce
     * @param array
     * @private
     * @return Promise<number> (category id)
     */
    async #insertCategoryIntoWooCommerce(array: UniversalDataFormatCategories): Promise<number> {
        return new Promise(((resolve, reject) => {
            const data = {
                name: array.name,
                parent: array.parent
            };
            this._WooCommerce.post("products/categories", data)
                .then((response) => {
                    debugger
                    resolve(response.data.id)
                })
                .catch((error) => {
                    reject(error)
                });
        }))
    }

    /**
     * insertItems - Funtion that will associate the category to the item and then insert isto WooCommerce
     * @param array
     * @private
     */
    async #insertItems(array: UniversalDataFormatItems) {
        return new Promise((resolve, reject) => {
            const data = {
                name: array.description,
                type: 'simple',
                regular_price: array.pvp_1.toString(),
                description: array.description_long,
                short_description: array.description_short,
                sku: array.bar_code,
                images: [
                    {
                        src: array.image
                    }
                ]
            };

            this._WooCommerce.post("products", data)
                .then((response) => {
                    resolve(true)
                })
                .catch((error) => {
                    reject();
                });
        })
    }

    async execute() {
        try {
            await this.#insertCategories(this._universalDataFormat.categories)
            await this.#insertItems(this._universalDataFormat.items);
        } catch (e) {
            console.log(e)
        }
    }
}

export {WooCommerce}