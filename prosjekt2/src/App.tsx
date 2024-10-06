import "./App.css";
import { AllSongsList } from "./components/AllSongsComponents/AllSongsList";
import Header from "./components/Header/Header";

import "./components/Filter/Filter";
import Filter from "./components/Filter/Filter";

function App() {


	return (
		<>
			<div className="appContainer">
				<Header />
				<Filter />
				<AllSongsList />
			</div>
		</>
	);
}

export default App;
