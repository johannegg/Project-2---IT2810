import { useState } from "react";
import "./App.css";
import { AllSongsList } from "./components/AllSongsComponents/AllSongsList";
import Header from "./components/header/header.tsx";

function App() {

	return (
		<>
			<Header></Header>
			<AllSongsList />
		</>
	);
}

export default App;
