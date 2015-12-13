import co from 'co';
import path from 'path';
import fs from 'co-fs-extra';
import mongoose from 'mongoose';
import config from '../src/config';

mongoose.connect(config.db);

import * as ArticleSchema from '../src/article.model';
const Article = mongoose.model(ArticleSchema.schemaName, ArticleSchema.schema);

co(function* setupDb() {
  const json = yield fs.readFile(path.resolve(__dirname, './entities.json'), 'utf8');
  const entities = JSON.parse(json);
  yield Article.create(entities);
  mongoose.connection.close();
  console.log('Generate articles completed');
}).catch(err => {
  console.log(err);
});
