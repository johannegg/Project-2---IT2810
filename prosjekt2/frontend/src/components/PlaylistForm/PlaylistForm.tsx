import React, { useState } from "react";
import "./PlaylistForm.css";

interface PlaylistFormProps {
	show: boolean;
	onClose: () => void;
	onSubmit: (playlistName: string, backgroundColor: string, icon: string) => void;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({ show, onClose, onSubmit }) => {
	const [inputValue, setInputValue] = useState("");
	const [backgroundColor, setBackgroundColor] = useState("#ffffff"); 
	const [selectedIcon, setSelectedIcon] = useState("🎵"); 

	const handleSubmit = () => {
		if (inputValue.trim()) {
			onSubmit(inputValue, backgroundColor, selectedIcon);
			onClose();
		}
	};

	if (!show) return null;

	// List of predefined colors
	const colorOptions = ["ffffff", "#e8dff5", "#fce1e4", "#fcf4dd", "#ddedea", "#daeaf6"];

	return (
		<div className="form-overlay">
			<div className="form-content">
				<h2>Create New Playlist</h2>
				<input
					type="text"
					placeholder="Enter playlist name"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					maxLength={20}
				/>

				<label>Select background color:</label>
				<div className="color-options">
					{colorOptions.map((color) => (
						<button
							key={color}
							className={`color-button ${backgroundColor === color ? "selected" : ""}`}
							style={{ backgroundColor: color }}
							onClick={() => setBackgroundColor(color)}
						/>
					))}
				</div>

				<label>Select an icon:</label>
				<div className="icon-options">
					<button
						className={selectedIcon === "🎵" ? "icon-button active" : "icon-button"}
						onClick={() => setSelectedIcon("🎵")}
					>
						🎵
					</button>
					<button
						className={selectedIcon === "🎸" ? "icon-button active" : "icon-button"}
						onClick={() => setSelectedIcon("🎸")}
					>
						🎸
					</button>
					<button
						className={selectedIcon === "🎤" ? "icon-button active" : "icon-button"}
						onClick={() => setSelectedIcon("🎤")}
					>
						🎤
					</button>
					<button
						className={selectedIcon === "🎧" ? "icon-button active" : "icon-button"}
						onClick={() => setSelectedIcon("🎧")}
					>
						🎧
					</button>
				</div>

				<button className="form-close-button" onClick={onClose}>
					Close
				</button>
				<button className="form-submit-button" onClick={handleSubmit}>
					Submit
				</button>
			</div>
		</div>
	);
};

export default PlaylistForm;
