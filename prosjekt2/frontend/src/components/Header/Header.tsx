import "./Header.css";
import couchIcon from "../../assets/couch.svg";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { BsMusicNoteList } from "react-icons/bs";
import Profile from "../Profile/Profile";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const handleNavigation = (path: string, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		const username = localStorage.getItem("profileName");
		if (username && username !== "") {
			navigate(path);
		} else {
			event.preventDefault();
			alert("You need to log in to access this page.");
		}
	};

	return (
		<header className="header">
			<Link to="/" className="header-content">
				<img src={couchIcon} alt="Sofa Icon" className="sofa-icon" />
				<h1 className="header-title">Lyrical Lounge</h1>
			</Link>
			<nav className="navbar">
				<Link
					to="/favorites"
					onClick={(e) => handleNavigation("/favorites", e)}
					className={`navButton ${location.pathname === "/favorites" ? "active" : ""}`}
				>
					<FontAwesomeIcon icon={faHeart} size="2x" className="navIcon" />
					<span className="navText">Favorited songs</span>
				</Link>
				<Link
					to="/playlists"
					onClick={(e) => handleNavigation("/playlists", e)}
					className={`navButton ${location.pathname === "/playlists" ? "active" : ""}`}
				>
					<BsMusicNoteList className="navIcon musicIcon" />
					<span className="navText">Your playlists</span>
				</Link>
				<Profile />
			</nav>
		</header>
	);
};

export default Header;
