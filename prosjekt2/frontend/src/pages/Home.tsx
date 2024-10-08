import { useNavigate } from "react-router-dom";
import { AllSongsList } from "../components/AllSongsComponents/AllSongsList";
import Filter from "../components/Filter/Filter";
import { useState } from "react";

const Home = () => {
    const navigate = useNavigate();
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const routeChange = (artistName: string, songTitle: string) => {
        const path = `/${artistName.toLowerCase().replace(/ /g, "-")}/${songTitle.toLowerCase().replace(/ /g, "-")}`;
        navigate(path);
    };

    const handleGenreChange = (genres: string[]) => {
        setSelectedGenres(genres);
    };

    return (
        <>
            <section className="appContainer">
                <Filter onGenreChange={handleGenreChange} />
				<AllSongsList genres={selectedGenres} />
			</section>
            {/* Example buttons to navigate to different songs */}
            <button onClick={() => routeChange("Ed Sheeran", "Perfect")}>
                Perfect by Ed Sheeran
            </button>
            <button onClick={() => routeChange("Ed Sheeran", "Shape of You")}>
                Shape of You by Ed Sheeran
            </button>
        </>
    );
};

export default Home;
