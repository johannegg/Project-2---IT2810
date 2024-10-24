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

  const colorOptions = [
    { color: "#ffffff", name: "White" },
    { color: "#e8dff5", name: "Purple" },
    { color: "#fce1e4", name: "Pink" },
    { color: "#fcf4dd", name: "Yellow" },
    { color: "#ddedea", name: "Green" },
    { color: "#daeaf6", name: "Blue" }
  ];

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
    { icon: "💔", name: "Broken Heart" }
  ];

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
            maxLength={15}
            className={hasError ? "input-error" : ""} 
          />
  
          <label>Select background color:</label>
          <div className="color-options">
            {colorOptions.map(({ color, name }) => (
              <button
                key={color}
                className={`color-button ${backgroundColor === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                type="button"
                onClick={() => setBackgroundColor(color)}
                data-colorname={name} 
              />
            ))}
          </div>
  
          <label>Select an icon:</label>
          <div className="icon-options">
            {iconOptions.map(({ icon, name }) => (
              <button
                key={icon}
                type="button"
                className={selectedIcon === icon ? "icon-button active" : "icon-button"}
                onClick={() => setSelectedIcon(icon)}
                data-iconname={name} 
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
}
  

export default PlaylistForm;
