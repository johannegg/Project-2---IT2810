export interface Song {
	id: number;
	title: string;
	artist: string;
	year: number;
	views: number;
	lyrics: string;
	genre: string;
}

export const fetchSongs = async (): Promise<Song[]> => {
	try {
		const response = await fetch("/mockdata.json");
		if (!response.ok) {
			throw new Error("Failed to fetch songs");
		}
		const data: Song[] = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching songs:", error);
		throw error;
	}
};
