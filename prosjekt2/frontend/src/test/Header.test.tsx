import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header/Header";

// Correctly mock useNavigate
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

// Mock the Profile component
vi.mock("../components/Profile/Profile", () => ({
    default: () => <div>Mock Profile</div>,
}));

describe("Header Component", () => {
    beforeEach(() => {
        // Reset mocks and localStorage before each test
        localStorage.clear();
        navigateMock.mockReset();
    });

    test("renders the header component", () => {
        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        // Check for header elements
        expect(screen.getByAltText("Sofa Icon")).toBeInTheDocument();
        expect(screen.getByText(/lyrical lounge/i)).toBeInTheDocument();
        expect(screen.getByText(/favorited songs/i)).toBeInTheDocument();
        expect(screen.getByText(/your playlists/i)).toBeInTheDocument();
        expect(screen.getByText(/mock profile/i)).toBeInTheDocument();

        // Take a snapshot of the rendered Header
        expect(container).toMatchSnapshot();
    });

    test("navigates to homepage when the title is clicked", () => {
        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const titleLink = screen.getByText(/lyrical lounge/i).closest("a");
        expect(titleLink).toHaveAttribute("href", "/");

        // Take a snapshot of the navigation behavior
        expect(container).toMatchSnapshot();
    });

    test("alerts and prevents navigation if not logged in", () => {
        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const favoritesLink = screen.getByText(/favorited songs/i).closest("a");
        const playlistsLink = screen.getByText(/your playlists/i).closest("a");

        // Mock the alert function
        window.alert = vi.fn();

        // Simulate clicking on links without being logged in
        fireEvent.click(favoritesLink!);
        fireEvent.click(playlistsLink!);

        expect(window.alert).toHaveBeenCalledWith("You need to log in to access this page.");
        expect(navigateMock).not.toHaveBeenCalled();

        // Take a snapshot of the behavior
        expect(container).toMatchSnapshot();
    });

    test("navigates to favorites or playlists if logged in", () => {
        localStorage.setItem("profileName", "testUser");

        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const favoritesLink = screen.getByText(/favorited songs/i).closest("a");
        const playlistsLink = screen.getByText(/your playlists/i).closest("a");

        // Simulate clicking on links when logged in
        fireEvent.click(favoritesLink!);
        fireEvent.click(playlistsLink!);

        expect(navigateMock).toHaveBeenCalledWith("/favorites");
        expect(navigateMock).toHaveBeenCalledWith("/playlists");

        // Take a snapshot of the logged-in navigation behavior
        expect(container).toMatchSnapshot();
    });

    test("highlights the active navigation link", () => {
        // Mock location.pathname
        Object.defineProperty(window, "location", {
            value: { pathname: "/favorites" },
            writable: true,
        });

        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const favoritesLink = screen.getByText(/favorited songs/i).closest("a");
        const playlistsLink = screen.getByText(/your playlists/i).closest("a");

        expect(favoritesLink).toHaveClass("active");
        expect(playlistsLink).not.toHaveClass("active");

        // Take a snapshot of the active link highlighting
        expect(container).toMatchSnapshot();
    });
});
