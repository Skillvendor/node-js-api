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

  type AuthData {
    user: User
    token: String!
  }

  input UserCreationInput {
    email: String!
    password: String!
  }

  input UserLogInInput {
    email: String!
    password: String!
  }

  input PostCreationInput {
    title: String!
    content: String!
  }

  type RootQuery {
    logIn(logInInput: UserLogInInput): AuthData
  }

  type RootMutation {
    createUser(userInput: UserCreationInput): User
    createPost(postInput: PostCreationInput): Post
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
