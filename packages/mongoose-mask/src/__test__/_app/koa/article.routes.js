import controller from './article.controllers.js'
import registerKoaRoutes from '../../../register-routes/register-koa-routes'

export default function register(router) {
  return registerKoaRoutes(router, controller, 'article')
}
