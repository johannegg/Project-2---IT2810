import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AllSongsList } from "../components/AllSongsComponents/AllSongsList";
import { SongData } from "../utils/types/SongTypes";

vi.mock("../components/FavoriteButton/FavoriteButton", () => ({
	default: ({ song }: { song: SongData }) => (
		<button data-testid={`favorite-button-${song.id}`}>Favorite</button>
	),
}));

vi.mock("../components/PlusMinusButton/PlusMinusButton", () => ({
	default: ({
		song,
		onSongRemoved,
	}: {
		song: SongData;
		onSongRemoved?: (songId: string) => void;
	}) => (
		<button data-testid={`plus-minus-button-${song.id}`} onClick={() => onSongRemoved?.(song.id)}>
			{onSongRemoved ? "Remove" : "Add"}
		</button>
	),
}));

const mockSongs: SongData[] = [
	{
		id: "1",
		title: "Song One",
		views: 5000,
		year: 2020,
		artist: { id: "a1", name: "Artist One" },
		genre: { name: "pop" },
		lyrics: "Lyrics of song one",
	},
	{
		id: "2",
		title: "Song Two",
		views: 2000,
		year: 2021,
		artist: { id: "a2", name: "Artist Two" },
		genre: { name: "rock" },
		lyrics: "Lyrics of song two",
	},
];

describe("AllSongsList Component", () => {
	const renderWithRouter = (component: React.ReactNode) => {
		return render(<MemoryRouter>{component}</MemoryRouter>);
	};

	it("renders correctly and matches snapshot", () => {
		const { asFragment } = renderWithRouter(
			<AllSongsList songs={mockSongs} selectedGenres={[]} maxViews={10000} minViews={0} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("filters songs by selectedGenres and maxViews", () => {
		renderWithRouter(
			<AllSongsList songs={mockSongs} selectedGenres={["pop"]} maxViews={6000} minViews={0} />,
		);

		expect(screen.getByText("Song One")).toBeInTheDocument();
		expect(screen.queryByText("Song Two")).not.toBeInTheDocument();
	});

	it("displays 'No songs found' when no songs match filters", () => {
		renderWithRouter(
			<AllSongsList
				songs={mockSongs}
				selectedGenres={["classical"]}
				maxViews={1000}
				minViews={0}
			/>,
		);

		expect(screen.getByText("No songs found")).toBeInTheDocument();
	});

	it("calls onSongRemoved when remove button is clicked", () => {
		const mockOnSongRemoved = vi.fn();

		renderWithRouter(
			<AllSongsList
				songs={mockSongs}
				selectedGenres={[]}
				maxViews={10000}
				minViews={0}
				isInPlaylist
				playlistId="playlist1"
				onSongRemoved={mockOnSongRemoved}
			/>,
		);

		const removeButton = screen.getByTestId("plus-minus-button-1");
		fireEvent.click(removeButton);

		expect(mockOnSongRemoved).toHaveBeenCalledWith("1");
	});

	it("renders FavoriteButton for each song", () => {
		renderWithRouter(
			<AllSongsList songs={mockSongs} selectedGenres={[]} maxViews={10000} minViews={0} />,
		);

		mockSongs.forEach((song) => {
			expect(screen.getByTestId(`favorite-button-${song.id}`)).toBeInTheDocument();
		});
	});
});
