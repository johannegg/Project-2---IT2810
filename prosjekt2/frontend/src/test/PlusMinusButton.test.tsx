import { render, screen, fireEvent } from "@testing-library/react";
import PlusMinusButton from "../components/PlusMinusButton/PlusMinusButton";
import { playlistsVar } from "../apollo/cache";
import { ADD_SONG_TO_PLAYLIST, REMOVE_SONG_FROM_PLAYLIST } from "../utils/Queries";
import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom";
import { describe, test, vi, beforeEach, beforeAll, expect } from "vitest";
import { waitFor } from "@testing-library/react";

// Mocking Apollo cache
vi.mock("../apollo/cache", async () => {
	const { makeVar } = await import("@apollo/client");
	return {
		playlistsVar: makeVar([]),
		isSidebarOpenVar: makeVar(false),
	};
});

describe("PlusMinusButton Component", () => {
	// Mock data for a song and playlist
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

	// Mock GraphQL responses
	const mocks = [
		{
			// Mocking the ADD_SONG_TO_PLAYLIST mutation
			request: {
				query: ADD_SONG_TO_PLAYLIST,
				variables: { username: "testUser", playlistId: "playlist1", songId: "1" },
			},
			result: { data: { addSongToPlaylist: { success: true } } },
		},
		{
			// Mocking the REMOVE_SONG_FROM_PLAYLIST mutation
			request: {
				query: REMOVE_SONG_FROM_PLAYLIST,
				variables: { username: "testUser", playlistId: "playlist1", songId: "1" },
			},
			result: { data: { removeSongFromPlaylist: { success: true } } },
		},
	];

	beforeAll(() => {
		// Mocking the window.alert function
		window.alert = vi.fn();
	});

	beforeEach(() => {
		// Resetting mocks and reactive variables before each test
		vi.resetAllMocks();
		playlistsVar([mockPlaylist]); // Setting initial state for playlists
		localStorage.setItem("profileName", "testUser");
	});

	test("renders the add button by default", () => {
		// Render component with MockedProvider for GraphQL
		const { asFragment } = render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} />
			</MockedProvider>,
		);

		// Assert that the "Add song" button is rendered
		expect(screen.getByRole("button", { name: "Add song" })).toBeInTheDocument();

		// Take a snapshot of the rendered component
		expect(asFragment()).toMatchSnapshot();
	});

	test("renders the remove button if isInPlaylist is true", () => {
		// Render component with isInPlaylist set to true
		const { asFragment } = render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} isInPlaylist playlistId="playlist1" />
			</MockedProvider>,
		);

		// Assert that the "Remove song" button is rendered
		expect(screen.getByRole("button", { name: "Remove song" })).toBeInTheDocument();

		// Take a snapshot of the rendered component
		expect(asFragment()).toMatchSnapshot();
	});

	test("displays modal when add button is clicked", () => {
		const { asFragment } = render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} />
			</MockedProvider>,
		);

		// Simulate a click on the "Add song" button
		fireEvent.click(screen.getByRole("button", { name: "Add song" }));

		// Assert that the modal is displayed
		expect(screen.getByText('Select a playlist to add "Test Song"')).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

		// Take a snapshot of the modal
		expect(asFragment()).toMatchSnapshot();
	});

	test("adds song to a playlist when a playlist button is clicked", async () => {
		const { asFragment } = render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} />
			</MockedProvider>,
		);

		// Simulate a click on the "Add song" button
		fireEvent.click(screen.getByRole("button", { name: "Add song" }));

		// Simulate a click on a playlist button in the modal
		fireEvent.click(screen.getByRole("button", { name: "Test Playlist 🎵" }));

		// Assert that the success feedback is displayed
		expect(await screen.findByText("Song successfully added!")).toBeInTheDocument();

		// Take a snapshot of the feedback message
		expect(asFragment()).toMatchSnapshot();
	});

	test("removes song from playlist when remove button is clicked", async () => {
		const { asFragment } = render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} isInPlaylist playlistId="playlist1" />
			</MockedProvider>,
		);

		// Simulate a click on the "Remove song" button
		fireEvent.click(screen.getByRole("button", { name: "Remove song" }));

		// Wait for the reactive variable to be updated
		await waitFor(() => {
			const updatedPlaylists = playlistsVar();
			const playlist = updatedPlaylists.find((p) => p.id === "playlist1");
			expect(playlist?.songs).not.toContainEqual(mockSong);
		});

		// Take a snapshot of the feedback message
		expect(asFragment()).toMatchSnapshot();
	});

	test("alerts user if not logged in when adding a song", () => {
		// Simulate a logged-out user
		localStorage.removeItem("profileName");

		const { asFragment } = render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<PlusMinusButton song={mockSong} />
			</MockedProvider>,
		);

		// Simulate a click on the "Add song" button
		fireEvent.click(screen.getByRole("button", { name: "Add song" }));

		// Assert that an alert is triggered
		expect(window.alert).toHaveBeenCalledWith("You need to be logged in to add songs to playlists");

		// Take a snapshot of the component in the logged-out state
		expect(asFragment()).toMatchSnapshot();
	});
});
