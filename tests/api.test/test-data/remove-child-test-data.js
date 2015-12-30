import path from 'path';

export const dataToCapture = [
  {
    name: 'Not Exists Child Id',
    request: {
      endpoint: `/article/567f8a571c17d9c58394970a/remove-child/tags/567f8a571c17d9c583949999`,
      action: 'del'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/remove-child/01-not-exists-child-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/remove-child/01-not-exists-child-response.json')
    }
  },
  {
    name: 'Not Exists Parent Id',
    request: {
      endpoint: `/article/567f8a571c17d9c583949999/remove-child/tags/567f8a571c17d9c583949712`,
      action: 'del'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/remove-child/02-not-exists-parent-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/remove-child/02-not-exists-parent-response.json')
    }
  },
  {
    name: 'Valid',
    request: {
      endpoint: `/article/567f8a571c17d9c58394970a/remove-child/tags/567f8a571c17d9c583949712`,
      action: 'del'
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/remove-child/03-valid-response.json')
    },
    expectResponse: {
      status: 200,
      bodyPath: path.resolve(__dirname, './generated-data/remove-child/03-valid-response.json')
    }
  }
];
