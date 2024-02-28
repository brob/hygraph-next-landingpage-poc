import { GraphQLClient } from 'graphql-request'


const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT)

export default client