const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql');

// Maps id to User object
const fakeDatabase = {
  a: {
    id: 'a',
    name: 'alice',
  },
  b: {
    id: 'b',
    name: 'bob',
  },
};

// Define the User type
// type User {
//   id: String
//   name: String
// }
const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  },
});

// Define the Query type
// type Query {
//   user(id: String): User
// }
const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: graphql.GraphQLString },
      },
      resolve: (root, { id }, context, info) => {
        return fakeDatabase[id];
      },
    },
  },
});

const schema = new graphql.GraphQLSchema({ query: queryType });

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log('Running a GraphQL API server at http://localhost:3000/graphql');
});
