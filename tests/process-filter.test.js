import { expect } from 'chai';
import BaseRepository from '../src/base-repository';
import * as ArticleSchema from './article.model';
const repository = new BaseRepository(ArticleSchema.schema, ArticleSchema.config);

describe('Process Filter', () => {
  it('Full Text Search', () => {
    const filter = repository.processFilter({text: 'lorem'});
    expect(filter).to.deep.equal({'$text': {'$search': 'lorem'}});
  });

  it('Regular Expression Case Insensitivity', () => {
    const filter = repository.processFilter({title: 'lorem'});
    expect(filter).to.deep.equal({title: /lorem/i});
  });

  it('Regular Expression Case Sensitivity', () => {
    const filter = repository.processFilter({code: 'lorem'});
    expect(filter).to.deep.equal({code: /lorem/});
  });

  it('Greater Than', () => {
    const filter = repository.processFilter({minCommentsCount: 10});
    expect(filter).to.deep.equal({commentsCount: {$gte: 10}});
  });

  it('Multiple conditions', () => {
    const filter = repository.processFilter({maxCommentsCount: 10, minConversionRate: 0.10});
    expect(filter).to.deep.equal({commentsCount: {$lte: 10}, conversionRate: {$gte: 0.1}});
  });

  it('Multiple conditions on 1 field', () => {
    const filter = repository.processFilter({minCommentsCount: 5, maxCommentsCount: 10});
    expect(filter).to.deep.equal({commentsCount: {$gte: 5, $lte: 10}});
  });
});
