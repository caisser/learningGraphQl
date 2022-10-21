const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

//Construct a schema, using graphQL schema language
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

// Maps username to content
const fakeDatabase = {};

const root = {
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: ({ input }) => {
    // Create a random id for our "database".
    const id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    console.log(fakeDatabase);
    return new Message(id, input);
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
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

// mutation create($input: MessageInput){
//   createMessage(input: $input) {
//     id,
//     author,
//     content
//   }
// }

// mutation modify($id: ID!, $input: MessageInput) {
// 	updateMessage(id: $id, input: $input) {
//     id,
//     author,
//     content
//   }
// }
