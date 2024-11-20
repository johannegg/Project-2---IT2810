import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header/Header";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

vi.mock("../components/Profile/Profile", () => ({
	default: () => <div>Mock Profile</div>,
}));

describe("Header Component", () => {
	beforeEach(() => {
		localStorage.clear();
		navigateMock.mockReset();
	});

	test("renders the header component", () => {
		const { container } = render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>,
		);

		expect(screen.getByAltText("Sofa Icon")).toBeInTheDocument();
		expect(screen.getByText(/lyrical lounge/i)).toBeInTheDocument();
		expect(screen.getByText(/favorited songs/i)).toBeInTheDocument();
		expect(screen.getByText(/your playlists/i)).toBeInTheDocument();
		expect(screen.getByText(/mock profile/i)).toBeInTheDocument();

		expect(container).toMatchSnapshot();
	});

	test("navigates to homepage when the title is clicked", () => {
		const { container } = render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>,
		);

		const titleLink = screen.getByText(/lyrical lounge/i).closest("a");
		expect(titleLink).toHaveAttribute("href", "/");

		expect(container).toMatchSnapshot();
	});

	test("alerts and prevents navigation if not logged in", () => {
		const { container } = render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>,
		);

		const favoritesLink = screen.getByText(/favorited songs/i).closest("a");
		const playlistsLink = screen.getByText(/your playlists/i).closest("a");

		window.alert = vi.fn();

		fireEvent.click(favoritesLink!);
		fireEvent.click(playlistsLink!);

		expect(window.alert).toHaveBeenCalledWith("You need to log in to access this page.");
		expect(navigateMock).not.toHaveBeenCalled();

		expect(container).toMatchSnapshot();
	});

	test("navigates to favorites or playlists if logged in", () => {
		localStorage.setItem("profileName", "testUser");

		const { container } = render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>,
		);

		const favoritesLink = screen.getByText(/favorited songs/i).closest("a");
		const playlistsLink = screen.getByText(/your playlists/i).closest("a");

		fireEvent.click(favoritesLink!);
		fireEvent.click(playlistsLink!);

		expect(navigateMock).toHaveBeenCalledWith("/favorites");
		expect(navigateMock).toHaveBeenCalledWith("/playlists");

		expect(container).toMatchSnapshot();
	});

	test("highlights the active navigation link", () => {
		Object.defineProperty(window, "location", {
			value: { pathname: "/favorites" },
			writable: true,
		});

		const { container } = render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>,
		);

		const favoritesLink = screen.getByText(/favorited songs/i).closest("a");
		const playlistsLink = screen.getByText(/your playlists/i).closest("a");

		expect(favoritesLink).toHaveClass("active");
		expect(playlistsLink).not.toHaveClass("active");

		expect(container).toMatchSnapshot();
	});
});
