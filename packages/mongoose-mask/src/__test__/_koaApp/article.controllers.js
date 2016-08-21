import ArticleRepository from './article.repository.js'
import createKoaController from '../../create-controller/create-koa-controller'

const repository = new ArticleRepository()
const controller = createKoaController(repository)

export default controller
