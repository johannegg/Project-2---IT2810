import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

interface BackButtonProps {
	text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ text = "Go back" }) => {
	const navigate = useNavigate();

	return (
		<button
			className="back-button"
			onClick={() => navigate(-1)}
			aria-label={text === "Go back" ? "Go back to the previous page" : text}
		>
			{/* Display a left-pointing arrow along with the button text */}
			&#10094; {text}
		</button>
	);
};

export default BackButton;
