import { useState } from "react";
import "./App.css";
import { AllSongsList } from "./components/AllSongsComponents/AllSongsList";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";

function App() {

	return (
		<>
			<Header></Header>
			<NavBar></NavBar>
			<AllSongsList />
		</>
	);
}

export default App;
