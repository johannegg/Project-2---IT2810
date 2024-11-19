import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

interface BackButtonProps {
	text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ text = "Go back" }) => {
	const navigate = useNavigate();

	return (
		<button className="back-button" onClick={() => navigate(-1)}>
			&#10094; {text}
		</button>
	);
};

export default BackButton;
