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
  const [hasError, setHasError] = useState(false); // Holder styr på inputfeil

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!inputValue.trim()) {
      setHasError(true); // Hvis navnet ikke er fylt inn, sett hasError til true
      return;
    }
    setHasError(false); // Hvis navnet er fylt inn, fjern eventuelle feil
    onSubmit(inputValue, backgroundColor, selectedIcon);
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
            className={hasError ? "input-error" : ""} // Legg til en klasse ved feil
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

        <button type="button" className="form-close-button" onClick={onClose}>
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
