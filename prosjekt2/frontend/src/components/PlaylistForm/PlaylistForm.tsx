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
  const [hasError, setHasError] = useState(false); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!inputValue.trim()) {
      setHasError(true); 
      return;
    }
    setHasError(false); 
    onSubmit(inputValue, backgroundColor, selectedIcon);
    handleClose(); 
  };

  const handleClose = () => {
    setInputValue(""); 
    setHasError(false); 
    onClose();
  };

  if (!show) return null;

  const colorOptions = ["#ffffff", "#e8dff5", "#fce1e4", "#fcf4dd", "#ddedea", "#daeaf6"];

  return (
    <div className="form-overlay">
      <form className="form-content" onSubmit={handleSubmit}>
        <h2>Create new playlist</h2>
        <fieldset>

          <label htmlFor="playlist-name">Enter playlist name:</label>
          <input
            id="playlist-name"
            type="text"
            placeholder="Enter playlist name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            maxLength={20}
            className={hasError ? "input-error" : ""} 
          />

          <label>Select background color:</label>
          <div className="color-options">
            {colorOptions.map((color) => (
              <button
                key={color}
                className={`color-button ${backgroundColor === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                type="button"
                onClick={() => setBackgroundColor(color)}
              />
            ))}
          </div>

          <label>Select an icon:</label>
          <div className="icon-options">
            {["🎵", "🎸", "🎤", "❤️‍🔥", "🍄", "🌸", "✨", "🎻", "📽️", "🧘‍♀️", "🏋️‍♀️", "🏃‍♀️‍➡️", "🦄", "🪩", "🕺", "🍂", "🌿", "🎄", "🎃", "💔"].map((icon) => (
              <button
                key={icon}
                type="button"
                className={selectedIcon === icon ? "icon-button active" : "icon-button"}
                onClick={() => setSelectedIcon(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
        </fieldset>

        <button type="button" className="form-close-button" onClick={handleClose}>
          Close
        </button>
        <button type="submit" className="form-submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PlaylistForm;
