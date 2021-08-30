const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/federation");

const query = gql`
  type Query {
    users: [User!]!
  }

  type User @key(fields: "id") {
    id: ID!
    name: String!
  }
`;
const typeDefs = [query];

const users = [
  {
    id: 1,
    name: "user name 1",
  },
  {
    id: 2,
    name: "user name 2",
  },
  {
    id: 3,
    name: "user name 3",
  },
  {
    id: 4,
    name: "user name 4",
  },
];

const fetchUserById = (id) =>  {
  return users.find((user) => user.id == id);
};

const resolvers = {
  Query: {
    users: () => users,
  },
  User: {
    __resolveReference(user) {
      return fetchUserById(user.id)
    }
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

server
  .listen(8080)
  .then(({ url }) => console.log(`Server is running on ${url}`));
