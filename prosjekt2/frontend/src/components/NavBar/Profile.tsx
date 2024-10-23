import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import "./Profile.css"

const Profile: React.FC = () => {
    const [profileName, setProfile] = useState<string>("");
    const [isLoggedIn, setLogin] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("")

    const logOut = () => {
        setLogin(false)
        localStorage.removeItem("profileName");
    }

    const logIn = () => {
        if (inputValue.trim() !== "") {
            setProfile(inputValue)
            setLogin(true);
            localStorage.setItem("profileName", profileName);
        }
    };
    
    useEffect(() => {
        const storedProfileName = localStorage.getItem("profileName") || "";
        if  (storedProfileName) {
            setProfile(storedProfileName);
            setLogin(true);
        }
    }, [])


    return (
        isLoggedIn ? (
            <div className="dropdown">
                <button className="profile">
                    <FontAwesomeIcon icon={faCircleUser} size="2xl"/>
                </button>
                <div className="dropdown-content">
                    <a onClick={() => logOut()}>Log out</a>
                </div>
            </div>
        ) : (
            <form className="profile-login">    
                <FontAwesomeIcon icon={faCircleUser} size="lg" style={{color: "#E27396"}}/>
                <input
                    className="login-input"
                    placeholder="Enter profile name"
				    onChange={(e) => setInputValue(e.target.value)}
			    />
                <button className="login-button" onClick={() => logIn()}>
                    <FontAwesomeIcon icon={faArrowRight} style={{color: "#FFF"}}/>
                </button>
            </form>
        )    
    )
}

export default Profile