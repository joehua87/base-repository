const slug = require('slug');
const faker = require('faker');
const co = require('co');
const fs = require('co-fs-extra');
const __ = require('lodash');

const destPath = require('path').resolve(__dirname, './entities.json');

const tags = [
  {slug: 'healthy-recipes', name: 'Healthy Recipes'},
  {slug: 'lose-weight', name: 'Lose Weight'},
  {slug: 'gain-muscle', name: 'Gain Muscle'},
  {slug: 'exercises', name: 'Exercises'}]

function generateArticle() {
  const title = faker.lorem.sentence() + ' ' + Math.floor(Math.random() * 99);
  const commentsCount = __.random(1, 10);
  const comments = [];
  for (let idx = 0; idx < commentsCount; idx++) {
    const username = faker.name.findName();
    comments.push({
      username,
      userId: idx + 1,
      point: __.random(5, true),
      content: faker.lorem.paragraph()
    });
  }
  const createdTime = faker.date.between(new Date(2014, 1, 1), new Date());
  const modifiedTime = faker.date.between(createdTime, new Date());

  return {
    slug: slug(title, {lower: true}),
    title,
    tags: __(tags).shuffle().take(__.random(1, 4)).value(),
    description: faker.lorem.paragraphs(),
    published: Math.random() > 0.5 ? true : false,
    comments,
    commentsCount,
    conversionRate: Math.random() / 4,
    createdTime,
    modifiedTime
  };
}

co(function* () {
  const articles = [];
  for (let idx = 0; idx < 100; idx++) {
    articles.push(generateArticle());
  }

  yield fs.writeFile(destPath, JSON.stringify(articles, null, 2));
  console.log('Generate Articles completely');
}).catch((err) => {
  console.log(err);
});
