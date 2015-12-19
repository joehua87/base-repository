/**
 * Register Routes for Koa App
 * @param router Koa Router
 */
export default function registerRoute(router, controller, routeName) {
  router.get(`/${routeName}/query`, controller.query);
  router.get(`/${routeName}/detail/:key`, controller.getByKey);
  router.get(`/${routeName}/id/:id`, controller.getById);
  router.post(`/${routeName}`, controller.insert);
  router.put(`/${routeName}/update`, controller.update);
  router.put(`/${routeName}/validate-update`, controller.validateUpdate);

  router.put(`/${routeName}/delete/:id`, controller.deleteById);
  router.put(`/${routeName}/:id/add-child/:field`, controller.addChild);
  router.del(`/${routeName}/:id/remove-child/:field/:itemId`, controller.removeChild);


  router.get(`/${routeName}/get-config`, controller.getConfig);
  router.get(`/${routeName}/get-schema`, controller.getSchema);
}
