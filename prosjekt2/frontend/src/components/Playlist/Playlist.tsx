import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Playlist.css";
import { SongData } from "../../utils/types/SongTypes";

interface PlaylistProps {
	id: string;
	name: string;
	backgroundColor: string;
	icon: string;
	songs: SongData[];
	onClick: () => void;
	tabIndex?: number;
	onKeyDown?: (event: React.KeyboardEvent) => void;
}

// Maps light mode background colors to dark mode equivalents
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
	"#445988": "#daeaf6",
};

const Playlist: React.FC<PlaylistProps> = ({
	id,
	name,
	backgroundColor,
	icon,
	songs,
	tabIndex,
}) => {
	const navigate = useNavigate();
	const [currentBackgroundColor, setCurrentBackgroundColor] = useState(backgroundColor);

	useEffect(() => {
		// Updates the background color based on system color scheme
		const updateBackgroundColor = () => {
			const isDarkModeActive = window.matchMedia("(prefers-color-scheme: dark)").matches;
			const targetColor =
				isDarkModeActive && backgroundColor in colorMapping
					? colorMapping[backgroundColor]
					: backgroundColor;

			setCurrentBackgroundColor(targetColor);
		};

		// Initial background color setup
		updateBackgroundColor();
		const colorSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)");
		colorSchemeMedia.addEventListener("change", updateBackgroundColor);

		// Cleanup event listener on component unmount
		return () => colorSchemeMedia.removeEventListener("change", updateBackgroundColor);
	}, [backgroundColor]);

	const handleClick = () => {
		// Navigate to playlist detail page with playlist data in state
		navigate(`/playlist/${id}`, {
			state: { playlist: { id, name, backgroundColor: currentBackgroundColor, icon, songs } },
		});
	};

	return (
		<article
			className="playlist-card"
			onClick={handleClick}
			tabIndex={tabIndex}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") handleClick();
			}}
			style={{ backgroundColor: currentBackgroundColor }}
			role="button"
		>
			<div className="playlist-icon" aria-hidden="true">
				{icon}
			</div>
			<h3 aria-label={`Playlist name: ${name}`}>{name}</h3>
		</article>
	);
};

export default Playlist;
