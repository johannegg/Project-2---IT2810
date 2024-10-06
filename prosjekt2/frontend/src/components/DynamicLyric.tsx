import { useParams } from "react-router-dom";


const DynamicLyric = () => {
    const { artistName, songTitle } = useParams<{ artistName: string; songTitle: string }>();
    

    return (
        <div>
            
        </div>
    );
};

export default DynamicLyric;
