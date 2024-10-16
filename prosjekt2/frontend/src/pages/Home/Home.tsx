import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { fetchSongs, Song } from "../../utils/FetchMockData";
import { GenreFilter } from "../../components/GenreFilter/GenreFilter";
import ViewsFilter from "../../components/ViewsFilter/ViewsFilter";
import "./Home.css";

const Home = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await fetchSongs();
				setSongs(data);
			} catch {
				setError("Failed to load data");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const handleGenreChange = (genres: string[]) => {
		setSelectedGenres(genres);
	};

	if (loading) return <p>Loading songs...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className="homeComponents">
			<SearchBar songs={songs} setSearchedSongs={setSearchedSongs} />
			<div className="appContainer">
				<GenreFilter onGenreChange={handleGenreChange} />
				<ViewsFilter />
				<AllSongsList songs={searchedSongs} genres={selectedGenres} />
			</div>
		</div>
	);
};

export default Home;
