import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites/Favorites";
import Playlists from "./pages/Playlists/Playlists";
import "./App.css";
import Header from "./components/Header/Header";
import DynamicLyric from "./components/Lyrics/DynamicLyrics";
import DynamicPlaylist from "./components/DisplayPlaylist/DynamicPlaylist";

function App() {
	return (
		<>
			<Router basename="project2">
				<section className="headerContainer">
					<Header />
				</section>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/playlists" element={<Playlists />} />
					<Route path="/:artistName/:songTitle" element={<DynamicLyric />} />
					<Route path="/playlist/:playlistId" element={<DynamicPlaylist />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
