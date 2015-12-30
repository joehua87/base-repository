import path from 'path';

export const dataToCapture = [
  {
    name: 'Not Exists Id',
    request: {
      endpoint: `/article/delete/567f8a571c17d9c583949999`,
      action: 'del'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/remove/01-not-exists-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/remove/01-not-exists-response.json')
    }
  },
  {
    name: 'Valid',
    request: {
      endpoint: `/article/delete/567f8a571c17d9c58394970a`,
      action: 'del'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/remove/02-valid-response.json')
    },
    expectResponse: {
      status: 200,
      bodyPath: path.resolve(__dirname, './generated-data/remove/02-valid-response.json')
    }
  }
];
