import { AllSongsList } from "../components/AllSongsComponents/AllSongsList";
import { useState } from "react";
import { Filter } from "../components/Filter/Filter";

const Home = () => {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const handleGenreChange = (genres: string[]) => {
        setSelectedGenres(genres);
    };

    return (
        <>
            <div className="appContainer">
                <Filter onGenreChange={handleGenreChange} />
                <AllSongsList genres={selectedGenres} />
			</div>
        </>
    );
};

export default Home;