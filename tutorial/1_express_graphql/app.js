const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

//Construct a schema, using graphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root query provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world';
  },
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log('Running a GraphQL API server at http://localhost:3000/graphql');
});
