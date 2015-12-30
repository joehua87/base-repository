import path from 'path';

export const dataToCapture = [
  {
    name: 'Valid Entity',
    request: {
      endpoint: `/article`,
      action: 'post',
      body: require('./initial-data/entity-to-insert-valid.json')
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/insert/01-valid-response.json')
    },
    expectResponse: {
      status: 201,
      bodyPath: path.resolve(__dirname, './generated-data/insert/01-valid-response.json')
    }
  },
  {
    name: 'Invalid Entity',
    request: {
      endpoint: `/article`,
      action: 'post',
      body: require('./initial-data/entity-to-insert-invalid.json')
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/insert/02-invalid-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/insert/02-invalid-response.json')
    }
  },
  {
    name: 'Duplicated Entity',
    request: {
      endpoint: `/article`,
      action: 'post',
      body: require('./initial-data/entity-to-insert-duplicated.json')
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/insert/03-duplicated-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/insert/03-duplicated-response.json')
    }
  }
];
