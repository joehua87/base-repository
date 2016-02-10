import ArticleRepository from './article.repository.js'
import { createController } from '../../src'

const repository = new ArticleRepository()
const controller = createController(repository)

export default controller
