import React from "react";
import { describe, test, vi, beforeAll, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Playlist from "../components/Playlist/Playlist";
import { SongData } from "../utils/types/SongTypes";
import "@testing-library/jest-dom";

// Mock implementation for the `useNavigate` hook
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

// Mock implementation of the `matchMedia` function for dark mode testing
beforeAll(() => {
	const listeners = [];
	vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
		matches: query === "(prefers-color-scheme: dark)",
		media: query,
		onchange: null,
		addEventListener: (event, listener) => {
			if (event === "change") {
				listeners.push(listener);
			}
		},
		removeEventListener: (event, listener) => {
			if (event === "change") {
				const index = listeners.indexOf(listener);
				if (index > -1) listeners.splice(index, 1);
			}
		},
		dispatchEvent: (event) => {
			listeners.forEach((listener) => listener(event));
		},
	}));
});

describe("Playlist Component", () => {
	// Mock song data used in tests
	const mockSongs: SongData[] = [
		{ id: "1", title: "Song 1", artist: "Artist 1", duration: 200 },
		{ id: "2", title: "Song 2", artist: "Artist 2", duration: 180 },
	];

	// Default props for the Playlist component
	const defaultProps = {
		id: "playlist1",
		name: "My Playlist",
		backgroundColor: "#ffffff",
		icon: "🎵",
		songs: mockSongs,
		tabIndex: 0,
	};

	// Test: Validate the rendering of name and icon
	test("renders name and icon", () => {
		const { asFragment } = render(
			<MemoryRouter>
				<Playlist {...defaultProps} />
			</MemoryRouter>,
		);

		expect(screen.getByText("My Playlist")).toBeInTheDocument();
		expect(screen.getByText("🎵")).toBeInTheDocument();

		// Snapshot test to ensure UI consistency
		expect(asFragment()).toMatchSnapshot();
	});

	// Test: Check navigation state with updated background color
	test("navigates with correct state including updated background color", () => {
		const mockSetCurrentBackgroundColor = vi.fn();

		// Mock `useState` to capture updates
		vi.spyOn(React, "useState").mockImplementationOnce(() => [
			"#8a8587", // Dark mode background color
			mockSetCurrentBackgroundColor,
		]);

		const { asFragment } = render(
			<MemoryRouter>
				<Playlist {...defaultProps} />
			</MemoryRouter>,
		);

		const playlistCard = screen.getByRole("button");
		fireEvent.click(playlistCard);

		// Verify that navigation was triggered with the correct state
		expect(mockNavigate).toHaveBeenCalledWith("/playlist/playlist1", {
			state: {
				playlist: {
					id: "playlist1",
					name: "My Playlist",
					backgroundColor: "#8a8587",
					icon: "🎵",
					songs: mockSongs,
				},
			},
		});

		// Snapshot test to ensure UI consistency
		expect(asFragment()).toMatchSnapshot();
	});

	// Test: Validate navigation with dynamically updated background color
	test("triggers navigation with dynamically updated background color", () => {
		const { asFragment, rerender } = render(
			<MemoryRouter>
				<Playlist {...defaultProps} />
			</MemoryRouter>,
		);

		// Simulate dark mode using matchMedia mock
		vi.spyOn(window.matchMedia("(prefers-color-scheme: dark)"), "matches", "get").mockReturnValue(
			true,
		);

		// Rerender the component to reflect dark mode changes
		rerender(
			<MemoryRouter>
				<Playlist {...defaultProps} />
			</MemoryRouter>,
		);

		const playlistCard = screen.getByRole("button");
		fireEvent.click(playlistCard);

		// Verify navigation with updated state for dark mode
		expect(mockNavigate).toHaveBeenCalledWith("/playlist/playlist1", {
			state: {
				playlist: {
					id: "playlist1",
					name: "My Playlist",
					backgroundColor: "#8a8587",
					icon: "🎵",
					songs: mockSongs,
				},
			},
		});

		// Snapshot test to ensure UI consistency
		expect(asFragment()).toMatchSnapshot();
	});

	// Test: Ensure correct number of songs are rendered
	test("renders the correct number of songs in the playlist", () => {
		const { asFragment } = render(
			<MemoryRouter>
				<Playlist {...defaultProps} />
			</MemoryRouter>,
		);

		const playlistCard = screen.getByRole("button");
		expect(playlistCard).toHaveTextContent("My Playlist");
		expect(mockSongs.length).toBe(2);

		// Snapshot test to ensure UI consistency
		expect(asFragment()).toMatchSnapshot();
	});

	// Test: Validate the tabIndex attribute for accessibility
	test("handles tabIndex correctly", () => {
		const { asFragment } = render(
			<MemoryRouter>
				<Playlist {...defaultProps} tabIndex={0} />
			</MemoryRouter>,
		);

		const playlistCard = screen.getByRole("button");
		expect(playlistCard).toHaveAttribute("tabIndex", "0");

		// Snapshot test to ensure UI consistency
		expect(asFragment()).toMatchSnapshot();
	});
});
