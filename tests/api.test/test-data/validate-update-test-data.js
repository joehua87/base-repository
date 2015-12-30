import path from 'path';

export const dataToCapture = [
  {
    name: 'Valid Entity',
    request: {
      endpoint: `/article/validate-update`,
      action: 'put',
      body: require('./initial-data/entity-to-update-valid.json')
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/validate-update/01-valid-response.json')
    },
    expectResponse: {
      status: 201,
      bodyPath: path.resolve(__dirname, './generated-data/validate-update/01-valid-response.json')
    }
  },
  {
    name: 'Invalid Entity',
    request: {
      endpoint: `/article/validate-update`,
      action: 'put',
      body: require('./initial-data/entity-to-update-invalid.json')
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/validate-update/02-invalid-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/validate-update/02-invalid-response.json')
    }
  },
  {
    name: 'Duplicated Entity',
    request: {
      endpoint: `/article/validate-update`,
      action: 'put',
      body: require('./initial-data/entity-to-update-duplicated-key.json')
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/validate-update/03-duplicated-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/validate-update/03-duplicated-response.json')
    }
  },
  {
    name: 'No Id',
    request: {
      endpoint: `/article/validate-update`,
      action: 'put',
      body: require('./initial-data/entity-to-update-no-id.json')
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/validate-update/04-no-id-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/validate-update/04-no-id-response.json')
    }
  },
  {
    name: 'Duplicated Entity',
    request: {
      endpoint: `/article/validate-update`,
      action: 'put',
      body: require('./initial-data/entity-to-update-not-exists.json')
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/validate-update/05-not-exists-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/validate-update/05-not-exists-response.json')
    }
  }
];
