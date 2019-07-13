const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type Post {
    id: ID!
    title: String!
    content: String!
    userId: String
    createdAt: String
    updatedAt: String
  }

  type User {
    id: ID!
    email: String!
    password: String
    posts: [Post!]
  }

  input UserCreationInput {
    email: String!
    password: String!
  }

  type RootQuery {
    hello: String
  }

  type RootMutation {
    createUser(userInput: UserCreationInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
