import { AllSongsList } from "../components/AllSongsComponents/AllSongsList";
import Filter from "../components/Filter/Filter";

const Home = () => {

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
