import { useState, useEffect } from "react";
import { Song } from "../../utils/FetchMockData";
import "./Filter.css";


function Filter() {
  const [data, setData] = useState<Song[]>([]);

  // Fetching data from mockdata.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/mockdata.json'); // Fetching mocked data
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: Song[] = await response.json();
        console.log('Fetched data:', result);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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