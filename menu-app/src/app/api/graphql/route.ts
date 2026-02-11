import { createSchema, createYoga } from "graphql-yoga";
import { getRandomMenus } from "@/lib/menu-repository";

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Menu {
        id: ID!
        name: String!
        category: String!
      }

      type Query {
        todayMenus(count: Int = 4): [Menu!]!
      }
    `,
    resolvers: {
      Query: {
        todayMenus: async (
          _parent,
          args: {
            count?: number;
          },
        ) => getRandomMenus(args.count ?? 4),
      },
    },
  }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: {
    Request,
    Response,
  },
});

export const runtime = "nodejs";
export { yoga as GET, yoga as POST, yoga as OPTIONS };
