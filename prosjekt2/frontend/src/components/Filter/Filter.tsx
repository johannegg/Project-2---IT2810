import { useEffect, useState } from "react";
import "./Filter.css";
import { FaFilter } from "react-icons/fa";
import { SongData } from "../../utils/types/SongTypes";

interface FilterProps {
  songs: SongData[];
  onGenreChange: (selectedGenres: string[]) => void;
}

export function Filter({ songs, onGenreChange }: FilterProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

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

  useEffect(() => {
		const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
		setSelectedGenres(savedGenres.length > 0 ? savedGenres : []);
	}, [])

  // Initial genres array
  const predefinedGenres = ["pop", "rb", "rap", "rock", "country"];

  // Find unique genres, starting with predefined ones
  const uniqueGenres = [...new Set([
    ...predefinedGenres, 
    ...songs.map(song => song.genre.name)
  ])];

  return (
    <> 
      <section className="filterContainer">
        <section className="filterHeader">
          <FaFilter className="filterSortIcon" />
          <h2>Filter</h2>
        </section>
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
