/* eslint-disable no-console */

import mongoose from 'mongoose'
import koa from 'koa'
import KoaRouter from 'koa-router'
import koaBodyParser from 'koa-bodyparser'
import koaJson from 'koa-json'
import koaQs from 'koa-qs'

import * as articleSchema from '../article.model.js'

mongoose.model(articleSchema.schemaName, articleSchema.schema)

const app = koa()
app.use(function* handleError(next) {
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

export default app
