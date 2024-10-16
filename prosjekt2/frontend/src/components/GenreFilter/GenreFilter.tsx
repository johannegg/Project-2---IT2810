import { useState, useEffect } from "react";
import { Song, fetchSongs } from "../../utils/FetchMockData";
import "./GenreFilter.css";

interface FilterProps {
  onGenreChange: (selectedGenres: string[]) => void;
}

export function GenreFilter({ onGenreChange }: FilterProps) {
  const [data, setData] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

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

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevSelected) => {
      const isSelected = prevSelected.includes(genre);
      const newSelectedGenres = isSelected 
        ? prevSelected.filter((g) => g !== genre) 
        : [...prevSelected, genre];

      onGenreChange(newSelectedGenres.length > 0 ? newSelectedGenres : []);
      return newSelectedGenres;
    });
  };

  // Finding unique genres to show in filter
  const uniqueGenres = [...new Set(data.map(song => song.genre))];

  return (
    <> 
      <section className="filterContainer">
        <h2>Genre</h2>
        <section className="categories">
          {uniqueGenres.map((genre, index) => (
            <div className="filterRow" key={index}>
              <input 
                type="checkbox" 
                id={genre} 
                checked={selectedGenres.includes(genre)} 
                onChange={() => handleGenreChange(genre)}
                />
              <label htmlFor={genre}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</label>
            </div>
          ))}
        </section>
      </section>
    </>
  );
}
