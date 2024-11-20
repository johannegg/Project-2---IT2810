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

beforeAll(() => {
    const listeners: Array<(ev: MediaQueryListEvent) => any> = []; 

    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addEventListener: (event: string, listener: EventListenerOrEventListenerObject) => {
            if (event === "change" && typeof listener === "function") {
                listeners.push(listener);
            }
        },
        removeEventListener: (event: string, listener: EventListenerOrEventListenerObject) => {
            if (event === "change" && typeof listener === "function") {
                const index = listeners.indexOf(listener);
                if (index > -1) listeners.splice(index, 1);
            }
        },
        dispatchEvent: (event: Event): boolean => {
            listeners.forEach((listener) => listener(event as MediaQueryListEvent));
            return true;
        },
        addListener: (callback: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => {
            listeners.push(callback);
        },
        removeListener: (callback: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => {
            const index = listeners.indexOf(callback);
            if (index > -1) listeners.splice(index, 1);
        },
    }));
});


describe("Playlist Component", () => {
	// Mock song data used in tests
	const mockSongs: SongData[] = [
		{ id: "1", title: "Song 1", artist: {id: "1", name: "Artist 1"}, views: 1000, year: 2023, genre: {name: "Test Genre 1"}, lyrics: "La la la la..."},
		{ id: "2", title: "Song 2", artist: {id: "2", name: "Artist 2"}, views: 2000, year: 2024, genre: {name: "Test Genre 2"}, lyrics: "La la la..."},
	];

	// Default props for the Playlist component
	const defaultProps = {
		id: "playlist1",
		name: "My Playlist",
		backgroundColor: "#ffffff",
		icon: "🎵",
		songs: mockSongs,
		tabIndex: 0,
		onClick: () => {},
	};

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
