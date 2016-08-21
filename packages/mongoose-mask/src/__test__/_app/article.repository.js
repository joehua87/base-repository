import mongoose from 'mongoose'
import * as ArticleSchema from './article.model.js'
import BaseRepository from '../../base-repository/base-repository'

const Article = mongoose.model(ArticleSchema.schemaName, ArticleSchema.schema)

export default class ArticleRepository extends BaseRepository {
  constructor() {
    super(Article, ArticleSchema.config)
  }
}
