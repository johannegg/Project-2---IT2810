import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../utils/Queries";
import { useNavigate } from "react-router-dom";
import { favoriteSongsVar, playlistsVar } from "../../apollo/cache";
import "./Profile.css";

const Profile: React.FC = () => {
	const [profileName, setProfile] = useState<string>("");
	const [isLoggedIn, setLogin] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");
	const [showLogin, setShowLogin] = useState<boolean>(false);
	const [createUser, { loading: creatingUser, error: userError }] = useMutation(CREATE_USER);

	const navigate = useNavigate();

	useEffect(() => {
		const storedProfileName = localStorage.getItem("profileName");
		if (storedProfileName) {
			setProfile(storedProfileName);
			setLogin(true);
		}
	}, []);

	const logOut = () => {
		setLogin(false);
		localStorage.removeItem("profileName");
		localStorage.removeItem("favoriteSongs");
		localStorage.removeItem("playlists");
		playlistsVar([]);
		favoriteSongsVar([]);
		setShowLogin(false);
		navigate("/");
	};

	const logIn = async () => {
		if (inputValue.trim() !== "") {
			try {
				const { data } = await createUser({ variables: { username: inputValue } });
				if (data && data.createUser) {
					setProfile(data.createUser.username);
					setLogin(true);
					favoriteSongsVar(data.createUser.favoriteSongs);
					localStorage.setItem("profileName", data.createUser.username);
					localStorage.setItem("favoriteSongs", JSON.stringify(data.createUser.favoriteSongs));
				}
			} catch (error) {
				console.error("Error creating or retrieving user:", error);
			}
		}
	};

	return (
		<>
			{isLoggedIn ? (
				<div className="dropdown" aria-label="User profile dropdown">
					<button className="profile-icon" aria-label="Profile icon menu" aria-expanded="true">
						<FontAwesomeIcon icon={faCircleUser} size="2xl" aria-hidden="true" />
					</button>
					<div className="dropdown-content" aria-label="Profile dropdown menu">
						<p className="profileName" aria-live="polite">
							You're logged in as "{profileName}"
						</p>
						<a onClick={logOut} aria-label="Log out" role="button">
							Log out
						</a>
					</div>
				</div>
			) : (
				<>
					<div className="dropdown" aria-label="Login dropdown">
						<button
							className="profile-icon"
							onClick={() => setShowLogin(!showLogin)}
							aria-label="Profile icon"
							aria-expanded={showLogin}
						>
							<FontAwesomeIcon icon={faCircleUser} size="2xl" aria-hidden="true" />
						</button>
					</div>
					{showLogin && (
						<div className="login-overlay">
							<FontAwesomeIcon
								className="close-login-button"
								icon={faXmark}
								onClick={() => setShowLogin(false)}
								aria-label="Close login form"
							/>
							<div
								className="profile-login"
								aria-labelledby="login-form-title"
								aria-label="Login form container"
							>
								<p id="login-form-title" className="login-information">
									{creatingUser
										? "Logging in..."
										: "Choose a unique username, or log in with an existing one"}
								</p>
								{userError && (
									<p className="error-message" role="alert">
										{userError.message}
									</p>
								)}
								<form
									className="login-form"
									onSubmit={(e) => {
										e.preventDefault();
										logIn();
									}}
									aria-label="Login form"
								>
									<FontAwesomeIcon
										className="profile-login-icon"
										icon={faCircleUser}
										size="lg"
										style={{ color: "#ea9ab2" }}
										aria-hidden="true"
									/>
									<input
										className="login-input"
										placeholder="Enter username"
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										aria-label="Enter username"
									/>
									<button className="login-button" type="submit" aria-label="Submit login">
										<FontAwesomeIcon
											icon={faArrowRight}
											style={{ color: "#FFF" }}
											aria-hidden="true"
										/>
									</button>
								</form>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default Profile;
