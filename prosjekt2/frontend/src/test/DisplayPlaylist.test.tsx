import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { PlaylistData } from "../pages/Playlists/Playlists";
import DisplayPlaylist from "../components/DisplayPlaylist/DisplayPlaylist";
import { makeVar } from "@apollo/client";
import { Artist, Genre } from "../utils/types/SongTypes";

const mockPlaylistsVar = makeVar<PlaylistData[]>([]);

vi.mock("@apollo/client", async (importOriginal) => {
	const actual = (await importOriginal()) as Record<string, unknown>;
	return {
		...actual,
		useReactiveVar: vi.fn(() => mockPlaylistsVar()),
		makeVar: actual.makeVar,
	};
});

// Create a mock Apollo Client
const mockApolloClient = new ApolloClient({
	uri: "http://localhost:4000", // Mock URL (not used in testing)
	cache: new InMemoryCache(),
});

const renderWithProviders = (component: React.ReactNode) => {
	return render(
		<ApolloProvider client={mockApolloClient}>
			<MemoryRouter>{component}</MemoryRouter>
		</ApolloProvider>,
	);
};

describe("DisplayPlaylist Component", () => {
	it("renders correctly and matches snapshot", () => {
		const mockArtist: Artist = { id: "a1", name: "Artist 1" };
		const mockGenre: Genre = { name: "pop" };

		const mockPlaylist: PlaylistData = {
			id: "1",
			name: "My Playlist",
			backgroundcolor: "#ffffff",
			icon: "🎵",
			songs: [
				{
					id: "s1",
					title: "Song 1",
					views: 1000,
					year: 2020,
					artist: mockArtist,
					genre: mockGenre,
					lyrics: "Some lyrics for song 1",
				},
			],
		};

		act(() => {
			mockPlaylistsVar([mockPlaylist]);
		});

		const { asFragment } = renderWithProviders(
			<DisplayPlaylist playlistId="1" onDelete={vi.fn()} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it('displays "Playlist not found" when no playlist matches', () => {
		act(() => {
			mockPlaylistsVar([]); // Set an empty playlist array
		});

		renderWithProviders(<DisplayPlaylist playlistId="invalid" onDelete={vi.fn()} />);

		expect(screen.getByText("Playlist not found")).toBeInTheDocument();
	});

	it("calls onDelete and closes modal when confirmed", () => {
		const mockOnDelete = vi.fn();

		const mockPlaylist: PlaylistData = {
			id: "1",
			name: "My Playlist",
			backgroundcolor: "#ffffff",
			icon: "🎵",
			songs: [
				{
					id: "s1",
					title: "Song 1",
					views: 1000,
					year: 2020,
					artist: { id: "a1", name: "Artist 1" },
					genre: { name: "pop" },
					lyrics: "Some lyrics for song 1",
				},
			],
		};

		act(() => {
			mockPlaylistsVar([mockPlaylist]);
		});

		renderWithProviders(<DisplayPlaylist playlistId="1" onDelete={mockOnDelete} />);

		const deleteButton = screen.getByRole("button", { name: /Delete playlist/i });
		fireEvent.click(deleteButton);

		expect(screen.getByText(/are you sure you want to delete this playlist/i)).toBeInTheDocument();

		const confirmButton = screen.getByText(/yes/i);
		fireEvent.click(confirmButton);

		expect(mockOnDelete).toHaveBeenCalled();

		expect(
			screen.queryByText(/are you sure you want to delete this playlist/i),
		).not.toBeInTheDocument();
	});
});
