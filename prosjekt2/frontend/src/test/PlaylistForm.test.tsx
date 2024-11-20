import { describe, test, vi, beforeEach, beforeAll, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PlaylistForm from "../components/PlaylistForm/PlaylistForm";

beforeAll(() => {
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
		onCloseMock = vi.fn();
		onSubmitMock = vi.fn();
	});

	test("renders correctly when show is true", () => {
		const { container } = render(
			<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);
		expect(screen.getByText(/create new playlist/i)).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	test("does not render when show is false", () => {
		const { container } = render(
			<PlaylistForm show={false} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);
		expect(screen.queryByText(/create new playlist/i)).not.toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	test("focuses on the input field when the form is shown", () => {
		const { getByPlaceholderText, container } = render(
			<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);
		const input = getByPlaceholderText(/enter playlist name/i);
		expect(document.activeElement).toBe(input);
		expect(container).toMatchSnapshot();
	});

	test("handles color selection", () => {
		const { container } = render(
			<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);
		const firstColorButton = screen.getAllByRole("button")[0];
		fireEvent.click(firstColorButton);
		expect(firstColorButton).toHaveClass("selected");
		expect(container).toMatchSnapshot();
	});

	test("handles icon selection", () => {
		const { container } = render(
			<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);
		const iconButton = screen.getByText("🎸");
		fireEvent.click(iconButton);
		expect(iconButton).toHaveClass("active");
		expect(container).toMatchSnapshot();
	});

	test("shows an error when input value is empty and Submit is clicked", () => {
		const { container } = render(
			<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);
		const submitButton = screen.getByText(/submit/i);
		fireEvent.click(submitButton); 
		expect(screen.getByPlaceholderText(/enter playlist name/i)).toHaveClass("input-error");
		expect(onSubmitMock).not.toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});

	test("calls onSubmit with correct values when the form is submitted", () => {
		const { container } = render(
			<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);
		const input = screen.getByPlaceholderText(/enter playlist name/i);
		const colorButton = screen.getAllByRole("button")[0];
		const iconButton = screen.getByText("🎸");
		const submitButton = screen.getByText(/submit/i);

		fireEvent.change(input, { target: { value: "My Playlist" } });
		fireEvent.click(colorButton);
		fireEvent.click(iconButton);
		fireEvent.click(submitButton);

		expect(onSubmitMock).toHaveBeenCalledWith("My Playlist", "#ffffff", "🎸", expect.any(String));
		expect(container).toMatchSnapshot();
	});

	test("calls onClose when the close button is clicked", () => {
		const { container } = render(
			<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);
		const closeButton = screen.getByText(/close/i);
		fireEvent.click(closeButton);
		expect(onCloseMock).toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});

	test("resets the form state after submission or close", () => {
		const { rerender, container } = render(
			<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />,
		);

		const input = screen.getByPlaceholderText(/enter playlist name/i);
		const colorButton = screen.getAllByRole("button")[0];
		const iconButton = screen.getByText("🎸");
		const closeButton = screen.getByText(/close/i);

		fireEvent.change(input, { target: { value: "My Playlist" } });
		fireEvent.click(colorButton);
		fireEvent.click(iconButton);
		fireEvent.click(closeButton);

		rerender(<PlaylistForm show={true} onClose={onCloseMock} onSubmit={onSubmitMock} />);

		expect(screen.getByPlaceholderText(/enter playlist name/i)).toHaveValue("");
		const selectedColorButton = screen.getAllByRole("button")[0];
		const selectedIconButton = screen.getByText("🎵");

		expect(selectedColorButton).toHaveClass("selected");
		expect(selectedIconButton).toHaveClass("active");

		expect(container).toMatchSnapshot();
	});
});
