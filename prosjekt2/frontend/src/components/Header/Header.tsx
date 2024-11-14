import "./Header.css";
import couchIcon from "../../assets/couch.svg";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { BsMusicNoteList } from "react-icons/bs";
import Profile from "../Profile/Profile";
import { useState, useEffect } from "react";

const Header: React.FC = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		const username = localStorage.getItem("profileName");
		if (username && username !== "") {
			setIsLoggedIn(true);
		}
	}, []);
	

	const handleNavigation = (path: string) => {
		const username = localStorage.getItem("profileName");
		if (username && username !== "") {
			setIsLoggedIn(true);
			navigate(path);
		} else {
			alert("You need to log in to access this page.");
		}
	};

	return (
		<header className="header">
			<Link to="/">
				<div className="header-content">
					<img src={couchIcon} alt="Sofa Icon" className="sofa-icon" />
					<h1 className="header-title">Lyrical Lounge</h1>
				</div>
			</Link>
			<nav className="navbar">
					<>
						<button
							type="button"
							onClick={() => handleNavigation("/favorites")}
							className={`navButton ${location.pathname === "/favorites" ? "active" : ""}`}
						>
							<FontAwesomeIcon icon={faHeart} size="2x" className="navIcon" />
							<span className="navText">Favorited songs</span>
						</button>
						<button
							type="button"
							onClick={() => handleNavigation("/playlists")}
							className={`navButton ${location.pathname === "/playlists" ? "active" : ""}`}
						>
							<BsMusicNoteList className="navIcon musicIcon" />
							<span className="navText">Your playlists</span>
						</button>
					</>
				<Profile />
			</nav>
		</header>
	);
};

export default Header;
