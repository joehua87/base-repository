import * as controller from './article.controllers.js';

export default function registerRoute(router) {
  router.post('/article/insert', controller.insert);
  router.put('/article/update', controller.update);
  router.get('/article/query', controller.query);
  router.get('/article/detail/:key', controller.getByKey);

  router.get('/article/id/:id', controller.getById);
  router.put('/article/:id/add-child/:field', controller.addChild);
  router.del('/article/:id/remove-child/:field/:itemId', controller.removeChild);
}
