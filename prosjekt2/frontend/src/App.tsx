import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites";
import Playlists from "./pages/Playlists";
import "./App.css";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";
import DynamicLyric from "./components/Lyrics/DynamicLyrics";

function App() {
	return (
		<>
			<Router>
				<Header />
				<NavBar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/playlists" element={<Playlists />} />
					{/* Dynamic route with artistName and songTitle */}
					<Route path="/:artistName/:songTitle" element={<DynamicLyric />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
