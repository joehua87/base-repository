import { expect } from 'chai'
import BaseRepository from '../base-repository'
import { config } from './article.model.js'
import parseQuery from '../parse-query'

describe('Process Filter', () => {
  it('Full Text Search', () => {
    const filter = parseQuery({ text: 'lorem' }, config)
    expect(filter).to.deep.equal({ $text: { $search: 'lorem' } })
  })

  it('Regular Expression Case Insensitivity', () => {
    const filter = parseQuery({ title: 'lorem' }, config)
    expect(filter).to.deep.equal({ title: /lorem/i })
  })

  it('Regular Expression Case Sensitivity', () => {
    const filter = parseQuery({ slug: 'lorem' }, config)
    expect(filter).to.deep.equal({ slug: /lorem/ })
  })

  it('Boolean', () => {
    const filter = parseQuery({ isFeatured: true }, config)
    expect(filter).to.deep.equal({ isFeatured: true })
  })

  it('Boolean with string - valid true', () => {
    const filter = parseQuery({ isFeatured: 'true' }, config)
    expect(filter).to.deep.equal({ isFeatured: true })
  })

  it('Boolean with string - valid false', () => {
    const filter = parseQuery({ isFeatured: 'false' }, config)
    expect(filter).to.deep.equal({ isFeatured: false })
  })

  it('Boolean with string - any other text will equal false', () => {
    const filter = parseQuery({ isFeatured: 'text' }, config)
    expect(filter).to.deep.equal({ isFeatured: false })
  })

  it('Exists', () => {
    const filter = parseQuery({ hasReview: true }, config)
    expect(filter).to.deep.equal({ reviews: { $exists: true } })
  })

  it('Greater Than', () => {
    const filter = parseQuery({ minCommentsCount: 10 }, config)
    expect(filter).to.deep.equal({ commentsCount: { $gte: 10 } })
  })

  it('Multiple conditions', () => {
    const filter = parseQuery({ maxCommentsCount: 10, minConversionRate: 0.10 }, config)
    expect(filter).to.deep.equal({ commentsCount: { $lte: 10 }, conversionRate: { $gte: 0.1 } })
  })

  it('Multiple conditions on 1 field', () => {
    const filter = parseQuery({ minCommentsCount: 5, maxCommentsCount: 10 }, config)
    expect(filter).to.deep.equal({ commentsCount: { $gte: 5, $lte: 10 } })
  })

  it('Contains array of string', () => {
    const filter = parseQuery({ commentUsernames: ['john', 'philip', 'peter'] }, config)
    expect(filter).to.deep.equal({ 'comments.username': { $in: ['john', 'philip', 'peter'] } })
  })

  it('Contains array of integer', () => {
    const filter = parseQuery({ commentUserIds: [1, 2, 3] }, config)
    expect(filter).to.deep.equal({ 'comments.userId': { $in: [1, 2, 3] } })
  })

  it('Contains array of float', () => {
    const filter = parseQuery({ commentrPoints: [1.1, 2.4, 4.4] }, config)
    expect(filter).to.deep.equal({ 'comments.point': { $in: [1.1, 2.4, 4.4] } }, config)
  })

  it('Contains array of string - need convert', () => {
    const filter = parseQuery({ commentUsernames: 'john' }, config)
    expect(filter).to.deep.equal({ 'comments.username': { $in: ['john'] } })
  })

  it('Contains array of integer - need convert', () => {
    const filter = parseQuery({ commentUserIds: 1 }, config)
    expect(filter).to.deep.equal({ 'comments.userId': { $in: [1] } })
  })

  it('Contains array of float - need convert', () => {
    const filter = parseQuery({ commentrPoints: 1.1 }, config)
    expect(filter).to.deep.equal({ 'comments.point': { $in: [1.1] } })
  })
})
