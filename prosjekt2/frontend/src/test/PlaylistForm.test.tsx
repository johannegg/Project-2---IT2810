import { describe, test, vi, beforeEach, beforeAll, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PlaylistForm from "../components/PlaylistForm/PlaylistForm";

beforeAll(() => {
    // Mock the window.matchMedia API to simulate different color schemes
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
            matches: query === "(prefers-color-scheme: dark)", 
            media: query,
            onchange: null,
            addListener: vi.fn(), 
            removeListener: vi.fn(), 
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});

describe("PlaylistForm Component", () => {
    let onCloseMock: ReturnType<typeof vi.fn>;
    let onSubmitMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Mock the onClose and onSubmit functions
        onCloseMock = vi.fn();
        onSubmitMock = vi.fn();
    });

    test("renders correctly when show is true", () => {
        // Render the component with the `show` prop set to true
        const { container } = render(
            <PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );
        expect(screen.getByText(/create new playlist/i)).toBeInTheDocument(); 
        expect(container).toMatchSnapshot(); 
    });

    test("does not render when show is false", () => {
        // Render the component with the `show` prop set to false
        const { container } = render(
            <PlaylistForm show={false} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );
        expect(screen.queryByText(/create new playlist/i)).not.toBeInTheDocument(); 
        expect(container).toMatchSnapshot(); 
    });

    test("focuses on the input field when the form is shown", () => {
        // Render the component and ensure the input field gains focus
        const { getByPlaceholderText, container } = render(
            <PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );
        const input = getByPlaceholderText(/enter playlist name/i);
        expect(document.activeElement).toBe(input); 
        expect(container).toMatchSnapshot(); 
    });

    test("handles color selection", () => {
        // Simulate a color button click and verify the selection
        const { container } = render(
            <PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );
        const firstColorButton = screen.getAllByRole("button")[0];
        fireEvent.click(firstColorButton);
        expect(firstColorButton).toHaveClass("selected"); 
        expect(container).toMatchSnapshot(); 
    });

    test("handles icon selection", () => {
        // Simulate an icon button click and verify the selection
        const { container } = render(
            <PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );
        const iconButton = screen.getByText("🎸");
        fireEvent.click(iconButton); 
        expect(iconButton).toHaveClass("active"); 
        expect(container).toMatchSnapshot();
    });

    test("shows an error when input value is empty and Submit is clicked", () => {
        // Simulate form submission with an empty input and verify error handling
        const { container } = render(
            <PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );
        const submitButton = screen.getByText(/submit/i);
        fireEvent.click(submitButton); // Simulate form submission
        expect(screen.getByPlaceholderText(/enter playlist name/i)).toHaveClass("input-error");
        expect(onSubmitMock).not.toHaveBeenCalled(); 
        expect(container).toMatchSnapshot(); 
    });

    test("calls onSubmit with correct values when the form is submitted", () => {
        // Simulate a valid form submission
        const { container } = render(
            <PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );
        const input = screen.getByPlaceholderText(/enter playlist name/i);
        const colorButton = screen.getAllByRole("button")[0];
        const iconButton = screen.getByText("🎸");
        const submitButton = screen.getByText(/submit/i);

        // Fill the form with valid data
        fireEvent.change(input, { target: { value: "My Playlist" } });
        fireEvent.click(colorButton);
        fireEvent.click(iconButton);
        fireEvent.click(submitButton);

        // Ensure onSubmit is called with the correct arguments
        expect(onSubmitMock).toHaveBeenCalledWith(
            "My Playlist",
            "#ffffff", 
            "🎸",
            expect.any(String) 
        );
        expect(container).toMatchSnapshot(); 
    });

    test("calls onClose when the close button is clicked", () => {
        // Simulate clicking the close button
        const { container } = render(
            <PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );
        const closeButton = screen.getByText(/close/i);
        fireEvent.click(closeButton); 
        expect(onCloseMock).toHaveBeenCalled(); 
        expect(container).toMatchSnapshot(); 
    });

    test("resets the form state after submission or close", () => {
        // Test if the form resets to its default state
        const { rerender, container } = render(
            <PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />
        );

        const input = screen.getByPlaceholderText(/enter playlist name/i);
        const colorButton = screen.getAllByRole("button")[0];
        const iconButton = screen.getByText("🎸");
        const closeButton = screen.getByText(/close/i);

        // Fill the form and close it
        fireEvent.change(input, { target: { value: "My Playlist" } });
        fireEvent.click(colorButton);
        fireEvent.click(iconButton);
        fireEvent.click(closeButton);

        // Reopen the form
        rerender(<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />);

        // Verify the form is reset
        expect(screen.getByPlaceholderText(/enter playlist name/i)).toHaveValue("");
        const selectedColorButton = screen.getAllByRole("button")[0];
        const selectedIconButton = screen.getByText("🎵");

        expect(selectedColorButton).toHaveClass("selected"); 
        expect(selectedIconButton).toHaveClass("active"); 

        expect(container).toMatchSnapshot(); 
    });
});
