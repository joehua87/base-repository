import {Schema} from 'mongoose';
import * as constant from '../src/constants';

export const schemaDefinition = {
  code: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String},
  published: {type: Boolean, required: true, default: false},
  comments: [
    {
      username: {type: String, required: true},
      content: {type: String, required: true}
    }
  ],
  commentsCount: {type: Number, required: true, default: 0},
  conversionRate: {type: Number, required: true, default: 0},
  createdTime: {type: String, required: true},
  modifiedTime: {type: String, required: true},
};

export const schema = new Schema(schemaDefinition);
schema.index({code: 1}, {unique: true});
schema.index({title: 'text', description: 'text'}, {weights: {title: 10, description: 3}});

export const config = {
  key: 'code',
  defaultLimit: 10,
  queryProjection: 'code title published commentsCount createdTime modifiedTime',
  detailProjection: 'code title published comments commentsCount conversionRate createdTime modifiedTime',
  fields: [
    {
      filterField: 'commentUsername',
      dbField: 'comments.username',
      compareType: constant.EQUAL,
      dbType: constant.STRING
    },
    {
      filterField: 'title',
      dbField: 'title',
      compareType: constant.REG_EX_I,
      dbType: constant.STRING
    },
    {
      filterField: 'code',
      dbField: 'code',
      compareType: constant.REG_EX,
      dbType: constant.STRING
    },
    {
      filterField: 'minCommentsCount',
      dbField: 'commentsCount',
      compareType: constant.GTE,
      dbType: constant.INTEGER
    },
    {
      filterField: 'maxCommentsCount',
      dbField: 'commentsCount',
      compareType: constant.LTE,
      dbType: constant.INTEGER
    },
    {
      filterField: 'minConversionRate',
      dbField: 'conversionRate',
      compareType: constant.GTE,
      dbType: constant.FLOAT
    },
    {
      filterField: 'maxConversionRate',
      dbField: 'conversionRate',
      compareType: constant.LTE,
      dbType: constant.FLOAT
    },
    {
      filterField: 'fromModifiedTime',
      dbField: 'modifiedTime',
      compareType: constant.GTE,
      dbType: constant.DATE
    },
    {
      filterField: 'toModifiedTime',
      dbField: 'modifiedTime',
      compareType: constant.LTE,
      dbType: constant.DATE
    },
    {
      filterField: 'text',
      compareType: constant.FULL_TEXT,
      dbType: constant.STRING
    }
  ]
};
