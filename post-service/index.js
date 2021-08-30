const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/federation");

const query = gql`
  type Query {
    posts: [Post!]!
  }

  type Post @key(fields: "id") {
    id: ID!
    title: String!
    description: String!
    user: User!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    posts: [Post]
  }
`;

const typeDefs = [query];

const posts = [
  {
    id: 1,
    user_id: 1,
    title: "post title 1",
    description: "abcdef  ddddddd",
  },
  {
    id: 2,
    user_id: 2,
    title: "post title 2",
    description: "abcdef  ddddddd",
  },
  {
    id: 3,
    user_id: 3,
    title: "post title 3",
    description: "abcdef  ddddddd",
  },
  {
    id: 4,
    user_id: 4,
    title: "post title 4",
    description: "abcdef  ddddddd",
  },
  {
    id: 5,
    user_id: 4,
    title: "post title 5",
    description: "abcdef  ddddddd",
  },
];

const fetchPostForUser = (user_id) => {
  return posts.filter((post) => post.user_id == user_id);
};

const resolvers = {
  Query: {
    posts: () => posts,
  },
  Post: {
    user(post) {
      return { __typename: "User", id: post.user_id };
    },
  },
  User: {
    posts(user) {
      return fetchPostForUser(user.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

server
  .listen(8081)
  .then(({ url }) => console.log(`Server is running on ${url}`));
