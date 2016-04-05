/**
 * Register Routes for Koa App
 * @param router Koa Router
 */
export default function registerRoute(router, controller, routeName, middleware: Array = []) {
  router.get(`/${routeName}/query`, ...middleware, ...middleware, controller.query)
  router.get(`/${routeName}/detail/:key`, ...middleware, controller.getByKey)
  router.get(`/${routeName}/id/:id`, ...middleware, controller.getById)
  router.get(`/${routeName}/ids`, ...middleware, controller.getByIds)
  router.get(`/${routeName}/detail-by-filter`, ...middleware, controller.getByFilter)

  router.post(`/${routeName}`, ...middleware, controller.insert)
  router.post(`/${routeName}/create`, ...middleware, controller.create)
  router.put(`/${routeName}/update`, ...middleware, controller.update)
  router.put(`/${routeName}/validate-update`, ...middleware, controller.validateUpdate)
  router.del(`/${routeName}/delete/:id`, ...middleware, controller.deleteById)

  router.put(`/${routeName}/:id/add-child/:field`, ...middleware, controller.addChild)
  router.del(`/${routeName}/:id/remove-child/:field/:itemId`, ...middleware, controller.removeChild)

  router.get(`/${routeName}/get-config`, ...middleware, controller.getConfig)
  router.get(`/${routeName}/get-schema`, ...middleware, controller.getSchema)
}
