import { render, screen, fireEvent } from "@testing-library/react";
import PlusMinusButton from "../components/PlusMinusButton/PlusMinusButton";
import { playlistsVar } from "../apollo/cache";
import { ADD_SONG_TO_PLAYLIST, REMOVE_SONG_FROM_PLAYLIST } from "../utils/Queries";
import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom";
import { describe, test, vi, beforeEach, beforeAll, expect } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("../apollo/cache", async () => {
	const { makeVar } = await import("@apollo/client");
	return {
		playlistsVar: makeVar([]),
		isSidebarOpenVar: makeVar(false),
	};
});

describe("PlusMinusButton Component", () => {
	const mockSong = {
		id: "1",
		title: "Test Song",
		artist: { id: "1", name: "Test Artist" },
		views: 1000,
		year: 2023,
		genre: { name: "Test Genre" },
		lyrics: "La la la...",
	};
	const mockPlaylist = {
		id: "playlist1",
		name: "Test Playlist",
		songs: [mockSong],
		backgroundcolor: "#ffffff",
		icon: "🎵",
	};

	const mocks = [
		{
			request: {
				query: ADD_SONG_TO_PLAYLIST,
				variables: { username: "testUser", playlistId: "playlist1", songId: "1" },
			},
			result: { data: { addSongToPlaylist: { success: true } } },
		},
		{
			request: {
				query: REMOVE_SONG_FROM_PLAYLIST,
				variables: { username: "testUser", playlistId: "playlist1", songId: "1" },
			},
			result: { data: { removeSongFromPlaylist: { success: true } } },
		},
	];

	beforeAll(() => {
		window.alert = vi.fn();
	});

	beforeEach(() => {
		vi.resetAllMocks();
		playlistsVar([mockPlaylist]);
		localStorage.setItem("profileName", "testUser");
	});

	test("renders the add button by default", () => {
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} />
			</MockedProvider>,
		);
		expect(screen.getByRole("button", { name: "Add song" })).toBeInTheDocument();
	});

	test("renders the remove button if isInPlaylist is true", () => {
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} isInPlaylist playlistId="playlist1" />
			</MockedProvider>,
		);
		expect(screen.getByRole("button", { name: "Remove song" })).toBeInTheDocument();
	});

	test("displays modal when add button is clicked", () => {
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} />
			</MockedProvider>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Add song" })); 
		expect(screen.getByText('Select a playlist to add "Test Song"')).toBeInTheDocument();
	});

	test("adds song to a playlist when a playlist button is clicked", async () => {
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} />
			</MockedProvider>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Add song" })); 
		fireEvent.click(screen.getByRole("button", { name: "Add song to playlist Test Playlist 🎵" }));
		expect(await screen.findByText("Song successfully added!")).toBeInTheDocument();
	});

	test("removes song from playlist when remove button is clicked", async () => {
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} isInPlaylist playlistId="playlist1" />
			</MockedProvider>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Remove song" })); 
		await waitFor(() => {
			const updatedPlaylists = playlistsVar();
			const playlist = updatedPlaylists.find((p) => p.id === "playlist1");
			expect(playlist?.songs).not.toContainEqual(mockSong);
		});
	});

	test("alerts user if not logged in when adding a song", () => {
		localStorage.removeItem("profileName");
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} />
			</MockedProvider>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Add song" })); 
		expect(window.alert).toHaveBeenCalledWith("You need to be logged in to add songs to playlists");
	});
});
