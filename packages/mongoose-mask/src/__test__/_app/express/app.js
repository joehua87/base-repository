/* eslint-disable no-console */

import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import koaQs from 'koa-qs'

import * as articleSchema from '../article.model.js'

mongoose.model(articleSchema.schemaName, articleSchema.schema)

const app = express()

app.use(bodyParser.json())
koaQs(app, 'extended')

require('./article.routes.js').default(app)

export default app
