/**
 * Register Routes for Koa App
 * @param app - Express App
 */
export default function registerRoute(app, controller, routeName, middleware: Array = []) {
  app.get(`/${routeName}/query`, middleware, controller.query)
  app.get(`/${routeName}/detail/:key`, middleware, controller.getByKey)
  app.get(`/${routeName}/id/:id`, middleware, controller.getById)
  app.get(`/${routeName}/ids`, middleware, controller.getByIds)
  app.get(`/${routeName}/detail-by-filter`, middleware, controller.getByFilter)

  app.post(`/${routeName}`, middleware, controller.insert)
  app.post(`/${routeName}/create`, middleware, controller.create)
  app.put(`/${routeName}/update`, middleware, controller.update)
  app.put(`/${routeName}/validate-update`, middleware, controller.validateUpdate)
  app.delete(`/${routeName}/delete/:id`, middleware, controller.deleteById)

  app.put(`/${routeName}/:id/add-child/:field`, middleware, controller.addChild)
  app.delete(`/${routeName}/:id/remove-child/:field/:itemId`, middleware, controller.removeChild)

  app.get(`/${routeName}/get-config`, middleware, controller.getConfig)
  app.get(`/${routeName}/get-schema`, middleware, controller.getSchema)
}
