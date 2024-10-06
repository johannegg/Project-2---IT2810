import { useState } from "react";
import "./App.css";
import { AllSongsList } from "./components/AllSongsComponents/AllSongsList";
import Header from "./components/Heading/Heading";

function App() {

	return (
		<>
			<Header></Header>
			<AllSongsList />
		</>
	);
}

export default App;
