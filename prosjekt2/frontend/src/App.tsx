import { useState } from "react";
import "./App.css";
import { AllSongsList } from "./components/AllSongsComponents/AllSongsList";
import Header from "./components/Header/Header";

function App() {

	return (
		<>
			<Header></Header>
			<AllSongsList />
		</>
	);
}

export default App;
