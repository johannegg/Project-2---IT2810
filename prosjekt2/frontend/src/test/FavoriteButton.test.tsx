import React from "react";
import { describe, test, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import FavoriteButton from "../components/FavoriteButton/FavoriteButton";
import { useReactiveVar, useMutation, ApolloClient, InMemoryCache } from "@apollo/client";
import { ADD_FAVORITE_SONG, REMOVE_FAVORITE_SONG } from "../utils/Queries";
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";

vi.mock("@apollo/client", async () => {
	const actual = await vi.importActual("@apollo/client");
	return {
		...actual,
		useReactiveVar: vi.fn(),
		useMutation: vi.fn(),
	};
});

vi.mock("@fortawesome/react-fontawesome", () => ({
	FontAwesomeIcon: ({
		icon,
		style,
	}: {
		icon: typeof heartSolid | typeof heartRegular;
		style: React.CSSProperties;
	}) => {
		const isSolidHeart = icon === heartSolid;
		const isRegularHeart = icon === heartRegular;
		const testId = isSolidHeart ? "icon-fas" : isRegularHeart ? "icon-far" : "unknown";

		return (
			<span data-testid={testId} style={style}>
				Icon
			</span>
		);
	},
}));

const mockSong = {
	id: "1",
	title: "Song One",
	artist: { id: "a1", name: "Artist One" },
	year: 2021,
	genre: { name: "Pop" },
	views: 1000,
	lyrics: "These are the lyrics for Song One.",
};

describe("FavoriteButton", () => {
	const addFavoriteMock = vi.fn();
	const removeFavoriteMock = vi.fn();

	const mockApolloClient = new ApolloClient({
		uri: "http://localhost:4000",
		cache: new InMemoryCache(),
	});

	beforeEach(() => {
		localStorage.setItem("profileName", "testUser");
		vi.mocked(useReactiveVar).mockReturnValue([]);
		vi.mocked(useMutation).mockImplementation((mutation) => {
			if (mutation === ADD_FAVORITE_SONG) {
				return [
					addFavoriteMock,
					{ loading: false, called: false, client: mockApolloClient, reset: vi.fn() },
				];
			}
			if (mutation === REMOVE_FAVORITE_SONG) {
				return [
					removeFavoriteMock,
					{ loading: false, called: false, client: mockApolloClient, reset: vi.fn() },
				];
			}
			throw new Error("Unknown mutation");
		});
	});

	afterEach(() => {
		cleanup();
		vi.resetAllMocks();
		localStorage.clear();
	});

	test("matches snapshot when song is not favorited", () => {
		const { container } = render(<FavoriteButton song={mockSong} />);
		expect(container).toMatchSnapshot();
	});

	test("matches snapshot when song is favorited", () => {
		vi.mocked(useReactiveVar).mockReturnValue([mockSong]);
		const { container } = render(<FavoriteButton song={mockSong} />);
		expect(container).toMatchSnapshot();
	});

	test("renders regular heart icon when song is not favorited", () => {
		render(<FavoriteButton song={mockSong} />);
		expect(screen.getByTestId("icon-far")).toBeInTheDocument();
	});

	test("renders solid heart icon when song is favorited", () => {
		vi.mocked(useReactiveVar).mockReturnValue([mockSong]);
		render(<FavoriteButton song={mockSong} />);
		expect(screen.getByTestId("icon-fas")).toBeInTheDocument();
	});

	test("calls addFavorite mutation when song is not favorited", async () => {
		render(<FavoriteButton song={mockSong} />);
		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(addFavoriteMock).toHaveBeenCalledWith({
			variables: { username: localStorage.getItem("profileName"), songId: mockSong.id },
		});
	});

	test("calls removeFavorite mutation when song is favorited", async () => {
		vi.mocked(useReactiveVar).mockReturnValue([mockSong]);
		render(<FavoriteButton song={mockSong} />);
		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(removeFavoriteMock).toHaveBeenCalledWith({
			variables: { username: localStorage.getItem("profileName"), songId: mockSong.id },
		});
	});

	test("shows an alert when user is not logged in and tries to favorite a song", () => {
		const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
		localStorage.setItem("profileName", "");

		render(<FavoriteButton song={mockSong} />);
		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(alertMock).toHaveBeenCalledWith("You need to log in to favorite songs");
		alertMock.mockRestore();
	});
});
