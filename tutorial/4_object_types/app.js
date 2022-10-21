const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

//Construct a schema, using graphQL schema language
const schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`);
// This class implements RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({ numRolls }) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}
// The root provides a resolver function for each API endpoint
const root = {
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6);
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
