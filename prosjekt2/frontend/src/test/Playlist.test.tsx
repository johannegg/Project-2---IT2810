import React from "react";
import { describe, test, vi, beforeAll, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Playlist from "../components/Playlist/Playlist";
import { SongData } from "../utils/types/SongTypes";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

beforeAll(() => {
	const listeners: Array<(ev: MediaQueryListEvent) => unknown> = [];

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
		addListener: (callback: (this: MediaQueryList, ev: MediaQueryListEvent) => unknown) => {
			listeners.push(callback);
		},
		removeListener: (callback: (this: MediaQueryList, ev: MediaQueryListEvent) => unknown) => {
			const index = listeners.indexOf(callback);
			if (index > -1) listeners.splice(index, 1);
		},
	}));
});

describe("Playlist Component", () => {
	const mockSongs: SongData[] = [
		{
			id: "1",
			title: "Song 1",
			artist: { id: "1", name: "Artist 1" },
			views: 1000,
			year: 2023,
			genre: { name: "Test Genre 1" },
			lyrics: "La la la la...",
		},
		{
			id: "2",
			title: "Song 2",
			artist: { id: "2", name: "Artist 2" },
			views: 2000,
			year: 2024,
			genre: { name: "Test Genre 2" },
			lyrics: "La la la...",
		},
	];

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

		expect(asFragment()).toMatchSnapshot();
	});

	test("navigates with correct state including updated background color", () => {
		const mockSetCurrentBackgroundColor = vi.fn();

		vi.spyOn(React, "useState").mockImplementationOnce(() => [
			"#8a8587", 
			mockSetCurrentBackgroundColor,
		]);

		const { asFragment } = render(
			<MemoryRouter>
				<Playlist {...defaultProps} />
			</MemoryRouter>,
		);

		const playlistCard = screen.getByRole("button");
		fireEvent.click(playlistCard);

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

		expect(asFragment()).toMatchSnapshot();
	});

	test("triggers navigation with dynamically updated background color", () => {
		const { asFragment, rerender } = render(
			<MemoryRouter>
				<Playlist {...defaultProps} />
			</MemoryRouter>,
		);

		vi.spyOn(window.matchMedia("(prefers-color-scheme: dark)"), "matches", "get").mockReturnValue(
			true,
		);

		rerender(
			<MemoryRouter>
				<Playlist {...defaultProps} />
			</MemoryRouter>,
		);

		const playlistCard = screen.getByRole("button");
		fireEvent.click(playlistCard);

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

		expect(asFragment()).toMatchSnapshot();
	});
});
