import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lyric from "./Lyrics";
import { songDataVar } from "../../apollo/cache";
import { useReactiveVar } from "@apollo/client";

const DynamicLyric = () => {
	const navigate = useNavigate();
	const songData = useReactiveVar(songDataVar);

	useEffect(() => {
		// Redirect to "not found" page if there is no song data
		if (!songData || songData.length === 0) {
			navigate("/not-found", { replace: true });
		}
	}, [songData, navigate]);

	// Show a fallback message if song data is unavailable
	if (!songData || songData.length === 0)
		return <div aria-label="Song not found message">Song not found</div>;

	return (
		<section aria-label={`Dynamic lyrics view for song: ${songData[0]?.title || "Unknown song"}`}>
			<Lyric songData={songData[0]} />
		</section>
	);
};

export default DynamicLyric;
