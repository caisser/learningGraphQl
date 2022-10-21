const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

//Construct a schema, using graphQL schema language
const schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  rollDice: ({ numDice, numSides }) => {
    const output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
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
