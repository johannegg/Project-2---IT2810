import { useNavigate } from "react-router-dom";
import { AllSongsList } from "../components/AllSongsComponents/AllSongsList";

const Home = () => {
    const navigate = useNavigate();

    const routeChange = (artistName: string, songTitle: string) => {
        const path = `/${artistName.toLowerCase().replace(/ /g, "-")}/${songTitle.toLowerCase().replace(/ /g, "-")}`;
        navigate(path);
    };

    return (
        <>
            <AllSongsList/>
            {/* Example buttons to navigate to different songs */}
            <button onClick={() => routeChange("Ed Sheeran", "Perfect")}>
                Perfect by Ed Sheeran
            </button>
            <button onClick={() => routeChange("Ed Sheeran", "Shape of You")}>
                Shape of You by Ed Sheeran
            </button>
        </>
    );
};

export default Home;
