export default function parseRequestQuery(request) {
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
