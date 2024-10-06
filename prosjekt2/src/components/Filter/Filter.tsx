import { useState, useEffect } from "react";
import { Song, fetchSongs } from "../../utils/FetchMockData";
import "./Filter.css";


function Filter() {
  const [data, setData] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

  // loading songs from mockdata.json
  useEffect(() => {
		const loadData = async () => {
			try {
				const data = await fetchSongs();
				setData(data);
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

  // Finding unique genres to show in filter
  const uniqueGenres = [...new Set(data.map(song => song.genre))];

  // TODO: Add functionality to filter songs based on genre
  return (
    <> 
      <section className="filterContainer">
        <h2>Genre</h2>
        {uniqueGenres.map((genre, index) => (
          <div className="filterRow" key={index}>
            <input type="checkbox" id={genre} />
            <label htmlFor={genre}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</label>
          </div>
        ))}
      </section>
    </>
  );
}

export default Filter;