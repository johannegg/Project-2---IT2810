import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SongData } from "../utils/types/SongTypes";
import Lyric from "../components/Lyrics/Lyrics";

vi.mock("../components/FavoriteButton/FavoriteButton", () => ({
	default: () => <button>Favorite</button>,
}));

vi.mock("../components/PlusMinusButton/PlusMinusButton", () => ({
	default: () => <button>Plus/Minus</button>,
}));

vi.mock("../components/BackButton/BackButton", () => ({
	default: () => <button>Back</button>,
}));

vi.mock("../utils/FormatViews", () => ({
	formatViews: (views: number) => `${views.toLocaleString()}`,
}));

describe("Lyric Component", () => {
	const mockSongData: SongData = {
		id: "1",
		title: "Test Song",
		views: 12345,
		year: 2022,
		artist: { id: "1", name: "Test Artist" },
		genre: { name: "Pop" },
		lyrics: "This is line 1\nThis is line 2\nThis is line 3",
	};

	test("matches snapshot", () => {
		const { container } = render(<Lyric songData={mockSongData} />);
		expect(container).toMatchSnapshot();
	});

	test("renders the Lyric component correctly", () => {
		render(<Lyric songData={mockSongData} />);

		expect(screen.getByRole("heading", { name: /test song/i })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: /test artist/i })).toBeInTheDocument();
		expect(screen.getByText(/release year: 2022/i)).toBeInTheDocument();
		expect(screen.getByText(/genre: pop/i)).toBeInTheDocument();
		expect(screen.getByText(/12,345 views/i)).toBeInTheDocument();

		expect(screen.getByText(/this is line 1/i)).toBeInTheDocument();
		expect(screen.getByText(/this is line 2/i)).toBeInTheDocument();
		expect(screen.getByText(/this is line 3/i)).toBeInTheDocument();

		expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /favorite/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /plus\/minus/i })).toBeInTheDocument();
	});

	test("formats views correctly", () => {
		render(<Lyric songData={mockSongData} />);

		expect(screen.getByText(/12,345 views/i)).toBeInTheDocument();
	});

	test("renders lyrics with line breaks", () => {
		render(<Lyric songData={mockSongData} />);

		const lines = screen.getAllByText(/this is line/i);
		expect(lines).toHaveLength(3);
	});

	test("interacts with buttons", async () => {
		const user = userEvent.setup();
		render(<Lyric songData={mockSongData} />);

		const backButton = screen.getByRole("button", { name: /back/i });
		const favoriteButton = screen.getByRole("button", { name: /favorite/i });
		const plusMinusButton = screen.getByRole("button", { name: /plus\/minus/i });

		await user.click(backButton);
		await user.click(favoriteButton);
		await user.click(plusMinusButton);

		expect(backButton).toBeEnabled();
		expect(favoriteButton).toBeEnabled();
		expect(plusMinusButton).toBeEnabled();
	});
});
