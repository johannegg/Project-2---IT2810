import React, { useState, useEffect, useRef, useMemo } from "react";
import "./PlaylistForm.css";
import { v4 as uuidv4 } from "uuid";

interface PlaylistFormProps {
	show: boolean;
	onClose: () => void;
	onSubmit: (playlistName: string, backgroundColor: string, icon: string, id: string) => void;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({ show, onClose, onSubmit }) => {
	const [inputValue, setInputValue] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("🎵");
	const [hasError, setHasError] = useState(false);
	const [selectedColor, setSelectedColor] = useState("#ffffff");
	const [isDarkMode, setIsDarkMode] = useState(
		window.matchMedia("(prefers-color-scheme: dark)").matches,
	);
	const inputRef = useRef<HTMLInputElement>(null);

	const lightModeColors = [
		{ color: "#ffffff", name: "White" },
		{ color: "#e8dff5", name: "Purple" },
		{ color: "#fce1e4", name: "Pink" },
		{ color: "#fcf4dd", name: "Yellow" },
		{ color: "#ddedea", name: "Green" },
		{ color: "#daeaf6", name: "Blue" },
	];

	const darkModeColors = [
		{ color: "#8a8587", name: "Dark Gray" },
		{ color: "#866f95", name: "Dark Purple" },
		{ color: "#9e3369", name: "Dark Pink" },
		{ color: "#d7ba28", name: "Dark Yellow" },
		{ color: "#35693f", name: "Dark Green" },
		{ color: "#445988", name: "Dark Blue" },
	];

	const colorMapping: { [key: string]: string } = useMemo(
		() => ({
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
		}),
		[],
	);

	useEffect(() => {
		if (show && inputRef.current) {
			inputRef.current.focus();
		}
	}, [show]);

	useEffect(() => {
		const updateDarkMode = (e: MediaQueryListEvent) => {
			setIsDarkMode(e.matches);
		};

		const colorSchemeMedia = window.matchMedia("(prefers-color-scheme: dark)");
		colorSchemeMedia.addEventListener("change", updateDarkMode);

		return () => colorSchemeMedia.removeEventListener("change", updateDarkMode);
	}, []);

	useEffect(() => {
		if (show) {
			const initialColor = isDarkMode ? colorMapping["#8a8587"] : "#ffffff";
			setSelectedColor(initialColor);
		}
	}, [show, isDarkMode, colorMapping]);

	const handleColorSelection = (color: string) => {
		const mappedColor = isDarkMode
			? colorMapping[color as keyof typeof colorMapping] || color
			: color;
		setSelectedColor(mappedColor);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim()) {
			setHasError(true);
			return;
		}
		setHasError(false);
		const playlistId = uuidv4();
		onSubmit(inputValue, selectedColor, selectedIcon, playlistId);
		handleClose();
	};

	const handleClose = () => {
		setInputValue("");
		setHasError(false);
		setSelectedIcon("🎵");
		setSelectedColor(isDarkMode ? colorMapping["#8a8587"] : "#ffffff");
		onClose();
	};

	if (!show) return null;

	const iconOptions = [
		{ icon: "🎵", name: "Music Note" },
		{ icon: "🎸", name: "Guitar" },
		{ icon: "🎤", name: "Microphone" },
		{ icon: "❤️‍🔥", name: "Heart on Fire" },
		{ icon: "🍄", name: "Mushroom" },
		{ icon: "🌸", name: "Flower" },
		{ icon: "✨", name: "Sparkles" },
		{ icon: "🎻", name: "Violin" },
		{ icon: "📽️", name: "Projector" },
		{ icon: "🧘‍♀️", name: "Yoga" },
		{ icon: "🏋️‍♀️", name: "Weight Lifting" },
		{ icon: "🏃‍♀️‍➡️", name: "Running" },
		{ icon: "🦄", name: "Unicorn" },
		{ icon: "🪩", name: "Disco Ball" },
		{ icon: "🕺", name: "Dancer" },
		{ icon: "🍂", name: "Autumn Leaf" },
		{ icon: "🌿", name: "Leaf" },
		{ icon: "🎄", name: "Christmas Tree" },
		{ icon: "🎃", name: "Pumpkin" },
		{ icon: "💔", name: "Broken Heart" },
	];

	const colorOptions = isDarkMode ? darkModeColors : lightModeColors;

	return (
		<div className="form-overlay" aria-label="Playlist creation form">
			<form className="form-content" onSubmit={handleSubmit} aria-labelledby="form-title">
				<h2 id="form-title">Create new playlist</h2>
				<fieldset>
					<label htmlFor="playlist-name" className="playlist-label">
						Enter playlist name:
					</label>
					<input
						id="playlist-name"
						type="text"
						placeholder="Enter playlist name"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						maxLength={15}
						ref={inputRef}
						className={`playlist-input ${hasError ? "input-error" : ""}`}
						aria-required="true"
						aria-invalid={hasError}
					/>

					<label className="playlist-label">Select background color:</label>
					<div className="color-options">
						{colorOptions.map(({ color, name }) => (
							<button
								key={color}
								className={`color-button ${selectedColor === (isDarkMode ? colorMapping[color] : color) ? "selected" : ""}`}
								style={{ backgroundColor: color }}
								type="button"
								onClick={() => handleColorSelection(color)}
								data-colorname={name}
								aria-label={`Select ${name} color`}
								aria-pressed={selectedColor === (isDarkMode ? colorMapping[color] : color)}
							/>
						))}
					</div>

					<label className="playlist-label">Select an icon:</label>
					<div className="icon-options">
						{iconOptions.map(({ icon, name }) => (
							<button
								key={icon}
								type="button"
								className={selectedIcon === icon ? "icon-button active" : "icon-button"}
								onClick={() => setSelectedIcon(icon)}
								data-iconname={name}
								aria-label={`Select ${name} icon`}
								aria-pressed={selectedIcon === icon}
							>
								{icon}
							</button>
						))}
					</div>
				</fieldset>

				<button
					type="button"
					className="form-close-button"
					onClick={handleClose}
					aria-label="Close playlist creation form"
				>
					Close
				</button>
				<button
					type="submit"
					className="form-submit-button"
					aria-label="Submit playlist creation form"
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default PlaylistForm;
