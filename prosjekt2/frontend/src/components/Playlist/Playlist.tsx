import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Playlist.css";
import { Song } from "../../utils/FetchMockData";

interface PlaylistProps {
	id: string;
	name: string;
	backgroundColor: string;
	icon: string;
	songs: Song[];
	onClick: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({ id, name, backgroundColor, icon, songs }) => {
	const navigate = useNavigate();
	const [currentBackgroundColor, setCurrentBackgroundColor] = useState(backgroundColor);

	useEffect(() => {
		const updateBackgroundColor = () => {
			const isDarkModeActive = window.matchMedia("(prefers-color-scheme: dark)").matches;
			const colorMapping: Record<string, string> = {
				"#ffffff": "#8a8587",
				"#e8dff5": "#866f95",
				"#fce1e4": "#9e3369",
				"#fcf4dd": "#d7ba28",
				"#ddedea": "#35693f",
				"#daeaf6": "#445988",
				"#8a8587": "#ffffff",
				"#866f95": "#e8dff5",
				"#9e3369": "#fce1e4",
				"#d7ba28": "#fcf4dd",
				"#35693f": "#ddedea",
				"#445988": "#daeaf6"
			  };

			const targetColor =
				isDarkModeActive && backgroundColor in colorMapping
					? colorMapping[backgroundColor]
					: backgroundColor;

			setCurrentBackgroundColor(targetColor);
		};

		updateBackgroundColor();
		const colorSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)");
		colorSchemeMedia.addEventListener("change", updateBackgroundColor);

		return () => colorSchemeMedia.removeEventListener("change", updateBackgroundColor);
	}, [backgroundColor]);

	const handleClick = () => {
		navigate(`/playlist/${id}`, {
			state: { playlist: { id, name, backgroundColor: currentBackgroundColor, icon, songs } },
		});
	};

	return (
		<article
			className="playlist-card"
			onClick={handleClick}
			style={{ backgroundColor: currentBackgroundColor }}
		>
			<div className="playlist-icon">{icon}</div>
			<h3>{name}</h3>
		</article>
	);
};

export default Playlist;
