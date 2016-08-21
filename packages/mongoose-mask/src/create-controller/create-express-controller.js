import parseRequestQuery from './parse-request-query'
const debug = require('debug')('base-repository:create-express-controller')

export default function createController(repository) {
  function query(req, res) {
    const { filter, select } = parseRequestQuery(req)
    repository
      .query(filter, select)
      .then((response) => {
        res.status(200).json(response)
      })
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  function update(req, res) {
    const entity = req.body
    if (!entity._id) {
      res.status(400).json({ message: 'Body required _id to update' })
    }

    repository
      .update(entity._id, entity)
      .then((response) => {
        res.status(201).json(response)
      })
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  function validateUpdate(req, res) {
    const entity = req.body
    if (!entity._id) {
      res.status(400).json({ message: 'Body required _id to update' })
    }

    repository.validateUpdate(entity._id, entity)
      .then((response) => {
        res.status(201).json(response)
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          res.status(400).json({ message: `Validate fail at: ${Object.keys(error.errors).join(', ')}` })
        } else {
          const pattern = /E11000 duplicate key error index: (.*?)\.(.*?) dup key: ({ : ".*?" })/
          const matches = pattern.exec(error.message)
          if (matches) {
            res.status(400).json({ message: `Duplicated at: ${matches[2]} ${matches[3]}` })
          }
          res.status(400).json({ message: error.message })
        }
      })
  }

  function create(req, res) {
    const filter = req.query.filter
    const entity = req.body

    repository
      .create(filter, entity)
      .then((response) => {
        res.status(201).json(response)
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          res.status(400).json({ message: `Validate fail at: ${Object.keys(error.errors).join(', ')}` })
        }
        res.status(400).json({ message: error.message })
      })
  }

  function insert(req, res) {
    const entities = req.body
    repository
      .insert(entities)
      .then((response) => {
        res.status(201).json(response)
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          res.status(400).json({ message: `Validate fail at: ${Object.keys(error.errors).join(', ')}` })
        } else {
          res.status(400).json({ message: error.message })
        }
      })
  }

  function getByKey(req, res) {
    const key = req.params.key
    if (!key) {
      res.status(400).json({ message: 'Request params required key' })
      return
    }
    repository
      .getByKey(key)
      .then((response) => {
        if (!response) res.status(400).json({ message: `Entity with key=${key} is not exists` })
        else res.status(200).json(response)
      })
  }

  function getById(req, res) {
    const { id } = req.params || {}
    const projection = req.query.projection
    debug(`get by id: ${id}`)
    if (!id) {
      res.status(400).json({ message: 'Params require query' })
      return
    }
    repository.getById(id, projection)
      .then((response) => {
        debug(`get by id response: ${response}`)
        if (!response) res.status(400).json({ message: `Entity with id=${id} is not exists` })
        else res.status(200).json(response)
      })
  }

  function getByIds(req, res) {
    let { ids = [] } = req.query || {}
    const projection = req.query.projection

    if (typeof ids === 'string') {
      ids = [ids]
    }

    debug(`get by id: ${ids.join(', ')}`)
    if (!ids) {
      res.status(400).json({ message: 'Params require query' })
      return
    }
    repository.getByIds(ids, projection)
      .then((response) => {
        debug(`get bt id response: ${response}`)
        res.status(200).json(response)
      })
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  function getByFilter(req, res) {
    const { filter, sort, projection } = req.query || {}
    debug(`get by filter (sort = ${sort})`)
    debug(filter)
    repository.getByFilter(filter, { sort, projection })
      .then((response) => {
        if (!response) res.status(400).json({ message: `Entity with filter=${JSON.stringify(filter)} is not exists` })
        else res.status(200).json(response)
      })
  }

  function deleteById(req, res) {
    const id = req.params.id
    if (!id) {
      res.status(400).json({ message: 'Request params required id' })
    }

    repository.deleteById(id)
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(400).json({ message: error.message }))
  }

  function addChild(req, res) {
    const id = req.params.id
    if (!id) {
      res.status(400).json({ message: 'Request params required id' })
    }

    const field = req.params.field
    if (!field) {
      res.status(400).json({ message: 'Request params required field' })
    }

    const item = req.body
    if (!item) {
      res.status(400).json({ message: 'Body require item to add' })
    }

    repository.addChild(id, field, item)
      .then((response) => res.status(201).json(response))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          res.status(400).json({ message: `Validate fail at: ${Object.keys(error.errors).join(', ')}` })
        } else {
          const pattern = /E11000 duplicate key error index: (.*?)\.(.*?) dup key: ({ : ".*?" })/
          const matches = pattern.exec(error.message)
          if (matches) {
            res.status(400).json({ message: `Duplicated at: ${matches[2]} ${matches[3]}` })
          }
          res.status(400).json({ message: error.message })
        }
      })
  }

  function removeChild(req, res) {
    const id = req.params.id
    if (!id) {
      res.status(400).json({ message: 'Request params required id' })
    }

    const field = req.params.field
    if (!field) {
      res.status(400).json({ message: 'Request params required field' })
    }

    const itemId = req.params.itemId
    if (!itemId) {
      res.status(400).json({ message: 'Request params required itemId' })
    }

    repository.removeChild(id, field, itemId)
      .then((response) => res.status(200).json(response))
      .catch((error) => res.status(400).json({ message: error.message }))
  }

  function getConfig(req, res) {
    res.status(200).json(repository.getConfig())
  }

  function getSchema(req, res) {
    res.status(200).json(repository.getSchema())
  }

  return {
    query,
    create,
    insert,
    update,
    validateUpdate,
    getByKey,
    getById,
    getByIds,
    getByFilter,
    deleteById,
    addChild,
    removeChild,
    getConfig,
    getSchema
  }
}
