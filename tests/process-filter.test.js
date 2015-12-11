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

  it('Boolean', () => {
    const filter = repository.processFilter({isFeatured: true});
    expect(filter).to.deep.equal({isFeatured: true});
  });

  it('Boolean with string - valid true', () => {
    const filter = repository.processFilter({isFeatured: 'true'});
    expect(filter).to.deep.equal({isFeatured: true});
  });

  it('Boolean with string - valid false', () => {
    const filter = repository.processFilter({isFeatured: 'false'});
    expect(filter).to.deep.equal({isFeatured: false});
  });

  it('Boolean with string - any other text will equal false', () => {
    const filter = repository.processFilter({isFeatured: 'text'});
    expect(filter).to.deep.equal({isFeatured: false});
  });

  it('Exists', () => {
    const filter = repository.processFilter({hasReview: true});
    expect(filter).to.deep.equal({reviews: {$exists: true}});
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

  it('Contains array of string', () => {
    const filter = repository.processFilter({commentUsernames: ['john', 'philip', 'peter']});
    expect(filter).to.deep.equal({'comments.username': {$in: ['john', 'philip', 'peter']}});
  });

  it('Contains array of integer', () => {
    const filter = repository.processFilter({commentUserIds: [1, 2, 3]});
    expect(filter).to.deep.equal({'comments.userId': {$in: [1, 2, 3]}});
  });

  it('Contains array of float', () => {
    const filter = repository.processFilter({commentrPoints: [1.1, 2.4, 4.4]});
    expect(filter).to.deep.equal({'comments.point': {$in: [1.1, 2.4, 4.4]}});
  });
});
