import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DynamicLyric from "./components/Lyrics/DynamicLyrics";
import "./App.css";
import Header from "./components/Header/Header";

function App() {
    return (
        <>
        <Header/>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* Dynamic route with artistName and songTitle */}
                <Route path="/:artistName/:songTitle" element={<DynamicLyric />} />
            </Routes>
        </Router>
        </>
    );
}

export default App;
