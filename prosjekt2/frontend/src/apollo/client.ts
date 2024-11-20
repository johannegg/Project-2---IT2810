import { ApolloClient } from "@apollo/client";
import cache from "./cache";

const client = new ApolloClient({
	uri: "http://localhost:3001/", // Use this to run locally, for tests
	//uri: "http://it2810-12.idi.ntnu.no:3001", // Use this to run on virtual machine
	cache: cache,
});

export default client;
