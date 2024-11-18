import { ApolloClient } from "@apollo/client";
import cache from "./cache";

const client = new ApolloClient({
	uri: "http://localhost:4000",
	cache: cache,
});

export default client;
