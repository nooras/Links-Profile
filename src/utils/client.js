import ApolloClient from "apollo-boost"

// const {
//   REACT_APP_STEPZEN_API_KEY,
//   REACT_APP_STEPZEN_ENDPOINT
// } = process.env

export const client = new ApolloClient({
  headers: {
    // Authorization: process.env.REACT_APP_STEPZEN_API_KEY,
    Authorization: "Apikey purral::stepzen.net+1000::17eec00a1cb0a4940a7aef4af9c47d1c7cdc9e50ca42378d2bfdaa84e83ecbb7",
  },
  uri: "https://purral.stepzen.net/api/melting-skunk/__graphql",
})