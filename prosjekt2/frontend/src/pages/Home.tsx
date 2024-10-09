import { useNavigate } from "react-router-dom";
import { AllSongsList } from "../components/AllSongsComponents/AllSongsList";
import Filter from "../components/Filter/Filter";

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="appContainer">
				<Filter />
				<AllSongsList />
			</div>
        </>
    );
};

export default Home;
