export default {
  entities: require('./request-test-data/entities.json'),
  queryData: {
    queryWithFilterRequest: {filter: {title: 'perferendis'}},
    queryWithSortRequest: {sort: '-title'},
    queryWithPagingRequest: {page: 1, limit: 5},
    queryWithGetAllRequest: {getAll: true},
    queryWithProjectionRequest: {projection: 'slug title tags'},
    queryWithNoDataRequest: {filter: {slug: 'no-data'}}
  },
  insertData: {
    validEntity: require('./request-test-data/entity-to-insert-valid.json'),
    invalidEntity: require('./request-test-data/entity-to-insert-invalid.json'),
    duplicatedEntity: require('./request-test-data/entity-to-insert-duplicated.json')
  },
  validateUpdateData: {
    validEntity: require('./request-test-data/entity-to-update-valid.json'),
    hasNoIdEntity: require('./request-test-data/entity-to-update-no-id.json'),
    notExistsEntity: require('./request-test-data/entity-to-update-not-exists.json'),
    invalidEntity: require('./request-test-data/entity-to-update-invalid.json'),
    duplicatedKeyEntity: require('./request-test-data/entity-to-update-duplicated-key.json')
  },
  removeData: {
    validId: '567f8a571c17d9c58394972f',
    noId: '',
    notExistsId: '567f8a571c17d9c583949999'
  },
  addChildData: {
    validRequest: {
      parentId: '567f8a571c17d9c58394972f',
      field: 'tags',
      itemToAdd: {
        slug: 'new-tag',
        title: 'New Tag'
      }
    },
    invalidChildRequest: {
      parentId: '567f8a571c17d9c58394972f',
      field: 'tags',
      itemToAdd: {
        slug: 'not-have-title'
      }
    },
    noParentIdRequest: {
      parentId: '',
      field: 'tags',
      itemToAdd: {
        slug: 'new-tag',
        title: 'New Tag'
      }
    },
    notExistsParentIdRequest: {
      parentId: '567f8a571c17d9c583949999',
      field: 'tags',
      itemToAdd: {
        slug: 'new-tag',
        title: 'New Tag'
      }
    },
    invalidFieldRequest: {
      parentId: '567f8a571c17d9c58394972f',
      field: 'notAvailable',
      itemToAdd: {
        slug: 'new-tag',
        title: 'New Tag'
      }
    }
  },
  removeChildData: {
    validRequest: {
      parentId: '567f8a571c17d9c58394972f',
      field: 'tags',
      childId: '567f8a571c17d9c58394973b'
    },
    noParentIdRequest: {
      parentId: '',
      field: 'tags',
      childId: '567f8a571c17d9c58394973b'
    },
    noChildIdRequest: {
      parentId: '567f8a571c17d9c58394972f',
      field: 'tags',
      childId: ''
    },
    notExistsParentIdRequest: {
      parentId: '567f8a571c17d9c5839499999',
      field: 'tags',
      childId: '567f8a571c17d9c58394973b'
    },
    notExistsChildIdRequest: {
      parentId: '567f8a571c17d9c58394972f',
      field: 'tags',
      childId: '567f8a571c17d9c583949999'
    },
    invalidFieldRequest: {
      parentId: '567f8a571c17d9c58394972f',
      field: 'notAvailable',
      childId: '567f8a571c17d9c58394973b'
    }
  }
};
