import ArticleRepository from '../article.repository.js'
import createExpressController from '../../../create-controller/create-express-controller'

const repository = new ArticleRepository()
const controller = createExpressController(repository)

export default controller
