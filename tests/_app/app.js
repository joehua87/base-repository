import mongoose from 'mongoose'
import koa from 'koa'
import KoaRouter from 'koa-router'
import koaBodyParser from 'koa-bodyparser'
import koaJson from 'koa-json'
import koaQs from 'koa-qs'

import * as articleSchema from './article.model.js'
import config from './config'

mongoose.model(articleSchema.schemaName, articleSchema.schema)

const app = koa()
app.use(function *(next) {
  try {
    yield next
  } catch (err) {
    this.status = err.status || 500
    this.body = { message: err.message }
    console.log(err)
    if (err.errors) {
      console.log(err.errors)
    }
  }
})

app.use(koaBodyParser())
app.use(koaJson())
koaQs(app, 'extended')

const router = new KoaRouter()
app.use(router.middleware())

require('./article.routes.js').default(router)

app.listen(config.port)

console.log(`App started. Go to http://localhost:${config.port}/article/query`)

export default app
