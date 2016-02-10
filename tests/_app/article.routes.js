import controller from './article.controllers.js'
import { registerRoutes } from '../../src'

export default function register(router) {
  return registerRoutes(router, controller, 'article')
}
