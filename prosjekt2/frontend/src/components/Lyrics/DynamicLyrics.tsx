import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lyric from "./Lyrics";
import { songDataVar } from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";

const DynamicLyric = () => {
	const navigate = useNavigate();
	const songData = useReactiveVar(songDataVar);

	useEffect(() => {
		if (!songData || songData.length === 0) {
			navigate("/not-found", { replace: true });
		}
	}, [songData, navigate]);

	if (!songData || songData.length === 0) return <div>Song not found</div>;

	return <Lyric songData={songData[0]} />;
};

export default DynamicLyric;
