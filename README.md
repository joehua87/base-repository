* The purpose of this project is to support define REST Api query
* Compatible with koa (generator)

# Examples:

* Querying article with commentsCount between 5 and 10
* Given: <code>minCommentsCount=5&maxCommentsCount=10</code>
* And you have the config file like file: tests/process-filter.test.js & tests/article.model.js
* It will parse the filter into <code>{commentsCount: {$gte: 5,$lte: 10}</code>

## Usage:

### BaseRepository
    ```javascript
    import * as ArticleSchema from './article.model';
    const repository = new BaseRepository(Article, ArticleSchema.config);
    const Article = mongoose.model(ArticleSchema.schemaName, ArticleSchema.schema);
    ```
View more at '/tests/base-repository.tests.js'

### createController
```javascript
import { createController } from 'base-repository';
const controller = createController(repository);
```
Controller Function:
* query
* insert
* update
* getByKey
* getById
* getByFilter
* deleteById
* addChild
* removeChild

# TODO
* Write an koa.js example

# Run Test
* <code>npm install</code>
* <code>npm test</code>