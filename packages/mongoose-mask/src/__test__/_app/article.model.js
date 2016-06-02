import { Schema } from 'mongoose'
import {
  EQUAL, GTE, LTE, REG_EX, REG_EX_I, FULL_TEXT, EXISTS, CONTAIN,
} from '../../constants'
import timePlugin from 'mongoose-time-plugin'

export const schemaName = 'Article'
export const routeName = 'article'

export const schemaDefinition = {
  slug: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  published: { type: Boolean, required: true, default: false },
  comments: [
    {
      userId: { type: Number, required: true },
      point: { type: Number, required: true },
      username: { type: String, required: true },
      content: { type: String, required: true }
    }
  ],
  tags: [{
    slug: { type: String, required: true },
    name: { type: String, required: true }
  }],
  isFeatured: { type: Boolean, required: true, default: false },
  reviews: Number,
  commentsCount: { type: Number, required: true, default: 0 },
  conversionRate: { type: Number, required: true, default: 0 },
  website: String,
}

export const schema = new Schema(schemaDefinition, { collection: schemaName })
schema.index({ slug: 1, website: 1 }, { unique: true })
schema.index({ title: 'text', description: 'text' }, { weights: { title: 10, description: 3 } })
schema.plugin(timePlugin)

export const config = {
  key: 'slug',
  defaultSort: 'slug',
  defaultLimit: 10,
  queryProjection: 'slug title description tags published isFeatured commentsCount conversionRate createdTime modifiedTime',
  detailProjection: 'slug title description tags published isFeatured commentsCount conversionRate createdTime modifiedTime',
  createOption: {
    slugField: 'slug',
    nameField: 'title',
    prefix: 'Untitled' // Is not required, default is slugged from namePrefix
  },
  fields: [
    {
      filterField: 'commentUsername',
      dbField: 'comments.username',
      compareType: EQUAL,
      dbType: String
    },
    {
      filterField: 'commentUsernames',
      dbField: 'comments.username',
      compareType: CONTAIN,
      dbType: Array
    },
    {
      filterField: 'commentUserIds',
      dbField: 'comments.userId',
      compareType: CONTAIN,
      dbType: Array
    },
    {
      filterField: 'commentrPoints',
      dbField: 'comments.point',
      compareType: CONTAIN,
      dbType: Array
    },
    {
      filterField: 'title',
      dbField: 'title',
      compareType: REG_EX_I,
      dbType: String
    },
    {
      filterField: 'slug',
      dbField: 'slug',
      compareType: REG_EX,
      dbType: String
    },
    {
      filterField: 'website',
      dbField: 'website',
      compareType: EQUAL,
      dbType: String
    },
    {
      filterField: 'tag',
      dbField: 'tags.slug',
      compareType: EQUAL,
      dbType: String
    },
    {
      filterField: 'tags',
      dbField: 'tags.slug',
      compareType: CONTAIN,
      dbType: Array
    },
    {
      filterField: 'minCommentsCount',
      dbField: 'commentsCount',
      compareType: GTE,
      dbType: Number
    },
    {
      filterField: 'maxCommentsCount',
      dbField: 'commentsCount',
      compareType: LTE,
      dbType: Number
    },
    {
      filterField: 'minConversionRate',
      dbField: 'conversionRate',
      compareType: GTE,
      dbType: Number
    },
    {
      filterField: 'maxConversionRate',
      dbField: 'conversionRate',
      compareType: LTE,
      dbType: Number
    },
    {
      filterField: 'fromModifiedTime',
      dbField: 'modifiedTime',
      compareType: GTE,
      dbType: Date
    },
    {
      filterField: 'toModifiedTime',
      dbField: 'modifiedTime',
      compareType: LTE,
      dbType: Date
    },
    {
      filterField: 'isFeatured',
      dbField: 'isFeatured',
      compareType: EQUAL,
      dbType: Boolean
    },
    {
      filterField: 'hasReview',
      dbField: 'reviews',
      compareType: EXISTS,
      dbType: Boolean
    },
    {
      filterField: 'text',
      compareType: FULL_TEXT,
      dbType: String
    }
  ]
}
