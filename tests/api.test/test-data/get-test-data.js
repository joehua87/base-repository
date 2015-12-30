import path from 'path';

export const dataToCapture = [
  {
    name: 'Valid Id',
    request: {
      endpoint: `/article/id/567f8a571c17d9c58394970a`,
      action: 'get'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/get/01-valid-id.json')
    },
    expectResponse: {
      status: 200,
      bodyPath: path.resolve(__dirname, './generated-data/get/01-valid-id.json')
    }
  },
  {
    name: 'Invalid Id',
    request: {
      endpoint: `/article/id/567f8a571c17d9c583949999`,
      action: 'get'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/get/02-not-exists-id.json')
    },
    expectResponse: {
      status: 204,
      bodyPath: path.resolve(__dirname, './generated-data/get/02-not-exists-id.json')
    }
  }
];
