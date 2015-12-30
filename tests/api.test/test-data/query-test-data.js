import path from 'path';

export const dataToCapture = [
  {
    name: 'Default query',
    request: {
      endpoint: `/article/query`,
      action: 'get'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/query/01-default-query.json')
    },
    expectResponse: {
      status: 200,
      bodyPath: path.resolve(__dirname, './generated-data/query/01-default-query.json')
    }
  },
  {
    name: 'Filter query',
    request: {
      endpoint: `/article/query`,
      query: {filter: {title: 'perferendis'}},
      action: 'get'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/query/02-filter-query.json')
    },
    expectResponse: {
      status: 200,
      bodyPath: path.resolve(__dirname, './generated-data/query/02-filter-query.json')
    }
  },
  {
    name: 'Sort query',
    request: {
      endpoint: `/article/query`,
      query: {sort: 'name'},
      action: 'get'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/query/03-sort-query.json')
    },
    expectResponse: {
      status: 200,
      bodyPath: path.resolve(__dirname, './generated-data/query/03-sort-query.json')
    }
  },
  {
    name: 'Paging query',
    request: {
      endpoint: `/article/query`,
      query: {page: 2, limit: 5},
      action: 'get'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/query/04-paging-query.json')
    },
    expectResponse: {
      status: 200,
      bodyPath: path.resolve(__dirname, './generated-data/query/04-paging-query.json')
    }
  },
  {
    name: 'No result query',
    request: {
      endpoint: `/article/query`,
      query: {filter: {title: 'no have result'}},
      action: 'get'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/query/05-no-result-query.json')
    },
    expectResponse: {
      status: 200,
      bodyPath: path.resolve(__dirname, './generated-data/query/05-no-result-query.json')
    }
  }];
