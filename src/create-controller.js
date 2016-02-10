const debug = require('debug')('create-controller')

// Export here for easy testing
export function parseRequestQuery(request) {
  const filter = request.query.filter
  const projection = request.query.projection
  const sort = request.query.sort
  const getAll = request.query.getAll === 'true'
  const page = parseInt(request.query.page, 10)
  const limit = parseInt(request.query.limit, 10)

  const select = { projection, sort, page, limit, getAll }

  // Remove to use default params in Base Repository
  if (!projection) {
    delete select.projection
  }
  if (!sort) {
    delete select.sort
  }
  if (isNaN(page)) {
    delete select.page
  }
  if (isNaN(limit)) {
    delete select.limit
  }

  return { filter, select }
}

export function createController(repository) {
  function* query() {
    const { filter, select } = parseRequestQuery(this.request)
    const response = yield repository.query(filter, select)
    this.status = 200
    this.body = response
  }

  function* update() {
    const entity = this.request.body
    if (!entity._id) {
      this.throw(400, 'Body required _id to update')
    }

    const response = yield repository.update(entity._id, entity)

    this.status = 201
    this.body = response
  }

  function* validateUpdate() {
    const entity = this.request.body
    if (!entity._id) {
      this.throw(400, 'Body required _id to update')
    }

    try {
      const response = yield repository.validateUpdate(entity._id, entity)
      this.status = 201
      this.body = response
    } catch (error) {
      if (error.name === 'ValidationError') {
        this.throw(400, `Validate fail at: ${Object.keys(error.errors).join(', ')}`)
      } else {
        const pattern = /E11000 duplicate key error index: (.*?)\.(.*?) dup key: ({ : ".*?" })/
        const matches = pattern.exec(error.message)
        if (matches) {
          this.throw(400, `Duplicated at: ${matches[2]} ${matches[3]}`)
        }
        this.throw(400, error)
      }
    }
  }

  function* create() {
    const filter = this.request.query.filter
    const entity = this.request.body

    try {
      const response = yield repository.create(filter, entity)
      this.status = 201
      this.body = response
    } catch (error) {
      if (error.name === 'ValidationError') {
        this.throw(400, `Validate fail at: ${Object.keys(error.errors).join(', ')}`)
      }
      this.throw(400, error)
    }
  }

  function* insert() {
    const entities = this.request.body
    try {
      const response = yield repository.insert(entities)
      this.status = 201
      this.body = response
    } catch (error) {
      if (error.name === 'ValidationError') {
        this.throw(400, `Validate fail at: ${Object.keys(error.errors).join(', ')}`)
      }
      this.throw(400, error)
    }
  }

  function* getByKey() {
    const key = this.params.key
    if (!key) {
      this.throw(400, 'Request params required key')
    }
    const response = yield repository.getByKey(key)

    this.status = 200
    this.body = response
  }

  function* getById() {
    const id = this.params.id
    debug(`get by id: ${id}`)
    if (!id) {
      this.throw(400, 'Params require query')
    }
    const response = yield repository.getById(id)
    debug(`get bt id response: ${response}`)
    this.status = 200
    this.body = response
  }

  function* getByFilter() {
    const filter = this.request.query.filter
    const sort = this.request.query.sort
    debug(`get by filter (sort = ${sort})`)
    debug(filter)
    const response = yield repository.getByFilter({ filter, sort })
    this.status = 200
    this.body = response
  }

  function* deleteById() {
    const id = this.params.id
    if (!id) {
      this.throw(400, 'Request params required id')
    }
    try {
      const response = yield repository.deleteById(id)
      this.status = 200
      this.body = response
    } catch (error) {
      this.throw(400, error)
    }
  }

  function* addChild() {
    const id = this.params.id
    if (!id) {
      this.throw(400, 'Request params required id')
    }

    const field = this.params.field
    if (!field) {
      this.throw(400, 'Request params required field')
    }

    const item = this.request.body
    if (!item) {
      this.throw(400, 'Body require item to add')
    }

    try {
      const response = yield repository.addChild(id, field, item)
      this.status = 201
      this.body = response
    } catch (error) {
      if (error.name === 'ValidationError') {
        this.throw(400, `Validate fail at: ${Object.keys(error.errors).join(', ')}`)
      } else {
        const pattern = /E11000 duplicate key error index: (.*?)\.(.*?) dup key: ({ : ".*?" })/
        const matches = pattern.exec(error.message)
        if (matches) {
          this.throw(400, `Duplicated at: ${matches[2]} ${matches[3]}`)
        }
        this.throw(400, error)
      }
    }
  }

  function* removeChild() {
    const id = this.params.id
    if (!id) {
      this.throw(400, 'Request params required id')
    }

    const field = this.params.field
    if (!field) {
      this.throw(400, 'Request params required field')
    }

    const itemId = this.params.itemId
    if (!itemId) {
      this.throw(400, 'Request params required itemId')
    }

    try {
      const response = yield repository.removeChild(id, field, itemId)
      this.status = 200
      this.body = response
    } catch (error) {
      this.throw(400, error)
    }
  }

  function* getConfig() {
    this.status = 200
    this.body = repository.getConfig()
  }

  function* getSchema() {
    this.status = 200
    this.body = repository.getSchema()
  }

  return {
    query,
    create,
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
  }
}
