// Export here for easy testing
export function parseQueryRequest(request) {
  const filter = request.query.filter;
  const projection = request.query.projection;
  const sort = request.query.sort;
  const getAll = request.query.getAll === 'true' ? true : false;
  const page = parseInt(request.query.page, 10);
  const limit = parseInt(request.query.limit, 10);

  const select = {projection, sort, page, limit, getAll};

  // Remove to use default params in Base Repository
  if (!projection) {
    delete select.projection;
  }
  if (!sort) {
    delete select.sort;
  }
  if (isNaN(page)) {
    delete select.page;
  }
  if (isNaN(limit)) {
    delete select.limit;
  }

  return {filter, select};
}

export default function createController(repository) {
  function* query() {
    const {filter, select} = parseQueryRequest(this.request);
    const response = yield repository.query(filter, select);
    this.status = 200;
    this.body = response;
  }

  function* update() {
    const entity = this.request.body;
    if (!entity._id) {
      this.throw(400, 'Body required _id to update');
    }

    console.log(entity);

    const response = yield repository.update(entity._id, entity);

    this.status = 201;
    this.body = response;
  }

  function* validateUpdate() {
    const entity = this.request.body;
    if (!entity._id) {
      this.throw(400, 'Body required _id to update');
    }

    console.log(entity);

    const response = yield repository.validateUpdate(entity._id, entity);

    this.status = 201;
    this.body = response;
  }

  function* insert() {
    const entities = this.request.body;
    const response = yield repository.insert(entities);

    this.status = 201;
    this.body = response;
  }

  function* getByKey() {
    const key = this.params.key;
    if (!key) {
      this.throw(400, 'Request params required key');
    }
    const response = yield repository.getByKey(key);

    this.status = 200;
    this.body = response;
  }

  function* getById() {
    const id = this.params.id;
    if (!id) {
      this.throw(400, 'Params require query');
    }
    const response = yield repository.getById(id);
    this.status = 200;
    this.body = response;
  }

  function* getByFilter() {
    const filter = this.request.filter;
    const response = yield repository.getByFilter(filter);
    this.status = 200;
    this.body = response;
  }

  function* deleteById() {
    const id = this.params.id;
    if (!id) {
      this.throw(400, 'Request params required id');
    }
    const response = yield repository.deleteById(id);

    this.status = 200;
    this.body = {_id: id, response};
  }

  function* addChild() {
    const id = this.params.id;
    if (!id) {
      this.throw(400, 'Request params required id');
    }

    const field = this.params.field;
    if (!field) {
      this.throw(400, 'Request params required field');
    }

    const item = this.request.body;
    if (!item) {
      this.throw(400, 'Body require item to add');
    }

    const response = yield repository.addChild(id, field, item);
    console.log(response);
    this.status = 200;
    this.body = response;
  }

  function* removeChild() {
    const id = this.params.id;
    if (!id) {
      this.throw(400, 'Request params required _id');
    }

    const field = this.params.field;
    if (!field) {
      this.throw(400, 'Request params required field');
    }

    const itemId = this.params.itemId;
    if (!itemId) {
      this.throw(400, 'Request params required itemId');
    }

    const response = yield repository.removeChild(id, field, itemId);

    this.status = 200;
    this.body = response;
  }

  function* getConfig() {
    this.status = 200;
    this.body = repository.getConfig();
  }

  function* getSchema() {
    this.status = 200;
    this.body = repository.getSchema();
  }

  return {
    query,
    insert,
    update,
    validateUpdate,
    getByKey,
    getById,
    getByFilter,
    deleteById,
    addChild,
    removeChild,
    getConfig,
    getSchema
  };
}
