import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import Filter from "../../components/Filter/Filter";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { fetchSongs, Song } from "../../utils/FetchMockData";

const Home = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

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

	if (loading) return <p>Loading songs...</p>;
	if (error) return <p>{error}</p>;

	return (
		<>
			<SearchBar songs={songs} setFilteredSongs={setFilteredSongs} />
			<div className="appContainer">
				<Filter />
				<AllSongsList songs={filteredSongs} />
			</div>
		</>
	);
};

export default Home;
