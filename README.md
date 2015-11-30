# Why?
* The purpose of this project is to support define REST Api query

# Examples:

* Querying article with commentsCount between 5 and 10
* Given: <code>minCommentsCount=5&maxCommentsCount=10</code>
* And you have the config file like file: tests/process-filter.test.js & tests/article.model.js
* It will parse the filter into <code>{commentsCount: {$gte: 5,$lte: 10}</code>

# TODO
* Write more Tests
* Export to ES6 npm package

# Run Test
* <code>npm install</code>
* <code>npm test</code>