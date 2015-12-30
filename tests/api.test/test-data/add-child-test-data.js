import path from 'path';

export const dataToCapture = [
  {
    name: 'Invalid Child',
    request: {
      endpoint: `/article/567f8a571c17d9c58394970a/add-child/tags`,
      action: 'put',
      body: {
        name: 'Healthy Recipes'
      }

    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/add-child/01-invalid-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/add-child/01-invalid-response.json')
    }
  },
  {
    name: 'Not Exists Parent',
    request: {
      endpoint: `/article/567f8a571c17d9c583949999/add-child/tags`,
      action: 'put',
      body: {
        slug: 'healthy-recipes',
        name: 'Healthy Recipes'
      }
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/add-child/02-not-exists-parent-response.json')
    },
    expectResponse: {
      status: 400,
      bodyPath: path.resolve(__dirname, './generated-data/add-child/02-not-exists-parent-response.json')
    }
  },
  {
    name: 'Valid Child',
    request: {
      endpoint: `/article/567f8a571c17d9c58394970a/add-child/tags`,
      action: 'put',
      body: {
        slug: 'healthy-recipes',
        name: 'Healthy Recipes'
      }
    },
    capture: {
      data: 'response',
      field: '',
      outputPath: path.resolve(__dirname, './generated-data/add-child/03-valid-response.json')
    },
    expectResponse: {
      status: 201,
      bodyPath: path.resolve(__dirname, './generated-data/add-child/03-valid-response.json')
    }
  }
];
