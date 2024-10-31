import { useEffect, useState } from "react";
import { AllSongsList } from "../../components/AllSongsComponents/AllSongsList";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Sidebar } from "../../components/SideBar/SideBar";
import { FilterButton } from "../../components/SideBar/FilterButton/FilterButton";
import { SongData } from "../../utils/types/SongTypes";
import { SongsQueryResponse } from "../../utils/types/QueryTypes";
import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../../utils/Queries";
import "./Home.css";

const Home = () => {
	const [songs, setSongs] = useState<SongData[]>([]);
	const [selectedGenres, setSelectedGenres] = useState<string[] | null>(null);
	const [sortOption, setSortOption] = useState<string>("views_desc");
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [showLoading, setShowLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const { loading, error, data, fetchMore, refetch } = useQuery<SongsQueryResponse>(GET_SONGS, {
		variables: {
			skip: 0,
			limit: 30,
			genres: selectedGenres || null,
			sortBy: sortOption,
			searchTerm,
		}, // Fetch the first 30 songs
	});

	// Append fetched songs on "Load More"
	const loadMoreSongs = () => {
		if (!data || !data.songs) return; // Prevent running if data is not available

		fetchMore({
			variables: {
				skip: songs.length, // Increment skip based on current number of songs fetched
				limit: 30,
			},
		})
			.then((response) => {
				const newSongs = response.data.songs;
				setSongs((prevSongs) => [...prevSongs, ...newSongs]);
			})
			.catch((error) => {
				console.error("Error fetching more songs: ", error);
			});
	};

	useEffect(() => {
		if (data && data.songs) {
			setSongs(data.songs);
		}
	}, [data]);

	// Trigger refetch on search, genre, or sort changes
	useEffect(() => {
		refetch({
			skip: 0,
			limit: 30,
			genres: selectedGenres || null,
			sortBy: sortOption,
			searchTerm,
		});
	}, [refetch, searchTerm, selectedGenres, sortOption]);

	// Load selected genres from session storage on initial render
	useEffect(() => {
		const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
		setSelectedGenres(savedGenres.length > 0 ? savedGenres : null);
	}, []);

	// Loading delay
	useEffect(() => {
		let loadingTimeout: NodeJS.Timeout;
		if (loading) {
			loadingTimeout = setTimeout(() => setShowLoading(true), 500);
		} else {
			setShowLoading(false);
		}
		return () => clearTimeout(loadingTimeout);
	}, [loading]);

	const handleGenreChange = (genres: string[]) => {
		setSelectedGenres(genres.length > 0 ? genres : null);
		sessionStorage.setItem("selectedGenres", JSON.stringify(genres));
	};

	const handleSortChange = (newSortOption: string) => {
		setSortOption(newSortOption);
	};

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	const handleSearchSubmit = (term: string) => {
		setSearchTerm(term);
	};

	if (error) return <p>{error?.message}</p>;

	return (
		<>
			<Sidebar
				onGenreChange={handleGenreChange}
				sortOption={sortOption}
				onSortChange={handleSortChange}
				songs={songs}
				onToggle={setIsSidebarOpen} //setIsSidebarOpen
				isOpen={isSidebarOpen}
			/>
			<section className={`homeComponents ${isSidebarOpen ? "shifted" : ""}`}>
				<section className="searchBarContainer">
					<SearchBar setSearchTerm={handleSearchSubmit} />
				</section>
				<section className="filterButtonContainer">
					<FilterButton onClick={toggleSidebar} />
				</section>
				{showLoading ? (
					<p>Loading songs...</p>
				) : (
					<section className="allSongsContainer">
						<AllSongsList songs={songs} genres={selectedGenres == null ? [] : selectedGenres} />
					</section>
				)}
				{!loading && songs.length >= 30 && (
					<button className="loadMoreButton" onClick={loadMoreSongs}>
						Load More Songs
					</button>
				)}
			</section>
		</>
	);
};

export default Home;
