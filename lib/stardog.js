const axios = require('axios')

const { Connection, query: _query } = require('stardog')

const conn = new Connection({
  username: 'admin',
  password: 'admin',
  endpoint: 'http://localhost:5820',
})

const query = (queryStr, opt = { reasoning: true }) => _query.execute(conn, 'test', queryStr, 'application/sparql-results+json', {
  reasoning: opt.reasoning,
})

const graphqlQuery = (query) => axios.post(`http://localhost:5820/test/graphql`, { query }, {
  auth: {
    username: 'admin',
    password: 'admin',
  }
})

module.exports = {
  query,
  graphqlQuery,
}
