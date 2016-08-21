import controller from './article.controllers.js'
import registerExpressRoutes from '../../../register-routes/register-express-routes'

export default function register(router) {
  return registerExpressRoutes(router, controller, 'article')
}
