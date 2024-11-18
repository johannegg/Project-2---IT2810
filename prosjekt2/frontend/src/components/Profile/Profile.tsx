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
	const [usernameTaken, setUsernameTaken] = useState<boolean>(false);
	
	// Initialize the createUser mutation
	const [createUser, { loading: creatingUser, error: userError }] = useMutation(CREATE_USER);
	
	const navigate = useNavigate()

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
		localStorage.removeItem("favoriteSongs")
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
					// If user creation is successful
					setProfile(data.createUser.username);
					setUsernameTaken(false);
					setLogin(true);
					favoriteSongsVar(data.createUser.favoriteSongs);
					localStorage.setItem("profileName", data.createUser.username);
					localStorage.setItem("favoriteSongs", JSON.stringify(data.createUser.favoriteSongs));
				}
			} catch (error) {
				console.error("Error creating or retriving user:", error);
			}
		}
	};

	return (
		<>
			{isLoggedIn ? (
				<div className="dropdown">
					<button className="profile-icon">
						<FontAwesomeIcon icon={faCircleUser} size="2xl" />
					</button>
					<div className="dropdown-content">
						<p className="profileName">You're logged in as "{profileName}"</p>
						<a onClick={logOut}>Log out</a>
					</div>
				</div>
			) : (
				<>
					<div className="dropdown">
						<button className="profile-icon" onClick={() => setShowLogin(!showLogin)}>
							<FontAwesomeIcon icon={faCircleUser} size="2xl" />
						</button>
					</div>
					{showLogin && (
						<div className="login-overlay">
						<FontAwesomeIcon
							className="close-login-button"
							icon={faXmark}
							onClick={() => setShowLogin(false)}
						/>
						<div className="profile-login">
							{usernameTaken ? (
								<>
									<p>This username is already taken. Do you want to proceed?</p>
									<div className="modal-buttons">
										<button
											className="cancel-button"
											onClick={() => {
												setUsernameTaken(false);
												setInputValue(""); // Reset input value for a new attempt
											}}
										>
											No
										</button>
										<button
											className="confirm-button"
											onClick={() => {
												setShowLogin(false);
												setUsernameTaken(false);
											}}
										>
											Yes
										</button>
									</div>
								</>
							) : (
								<>
									<p className="login-information">
										{creatingUser
											? "Logging in..."
											: "Choose a unique username, or log in with an existing one"}
									</p>
									{userError && (
										<p className="error-message">{userError.message}</p>
									)}
									<form
										className="login-form"
										onSubmit={(e) => {
											e.preventDefault();
											logIn();
										}}
									>
										<FontAwesomeIcon
											className="profile-login-icon"
											icon={faCircleUser}
											size="lg"
											style={{ color: "#ea9ab2" }}
										/>
										<input
											className="login-input"
											placeholder="Enter username"
											value={inputValue}
											onChange={(e) => setInputValue(e.target.value)}
										/>
										<button className="login-button" type="submit">
											<FontAwesomeIcon icon={faArrowRight} style={{ color: "#FFF" }} />
										</button>
									</form>
								</>
							)}
						</div>
					</div>
					)}
				</>
			)}
		</>
	);
};

export default Profile;


