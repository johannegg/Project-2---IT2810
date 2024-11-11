import "./Header.css";
import couchIcon from "../../assets/couch.svg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { BsMusicNoteList } from "react-icons/bs";
import Profile from "../Profile/Profile";

const Header: React.FC = () => {
	return (
		<header className="header">
			<Link to="/">
				<div className="header-content">
					<img src={couchIcon} alt="Sofa Icon" className="sofa-icon" />
					<h1 className="header-title">Lyrical Lounge</h1>
				</div>
			</Link>
			<nav className="navbar">
				<Link to="/favorites">
					<button
						type="button"
						className={`navButton ${location.pathname === "/favorites" ? "active" : ""}`}
					>
						<FontAwesomeIcon icon={faHeart} size="2x" className="navIcon" />
						<span className="navText">Favorited songs</span>
					</button>
				</Link>
				<Link to="/playlists">
					<button
						type="button"
						className={`navButton ${location.pathname === "/playlists" ? "active" : ""}`}
					>
						<BsMusicNoteList className="navIcon musicIcon" />
						<span className="navText">Your playlists</span>
					</button>
				</Link>
				<Profile />
			</nav>
		</header>
	);
};

export default Header;
