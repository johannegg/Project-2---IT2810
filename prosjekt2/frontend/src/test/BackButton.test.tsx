import { describe, test, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import BackButton from "../components/BackButton/BackButton";
import { MemoryRouter } from "react-router-dom"; // Provides router context for testing

// Mock implementation of useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(),
	};
});

// Import mocked useNavigate
import { useNavigate } from "react-router-dom";

describe("BackButton", () => {
	const mockNavigate = vi.fn(); // Mock function for navigation

	// Set up mock before each test
	beforeEach(() => {
		vi.mocked(useNavigate).mockReturnValue(mockNavigate);
	});

	// Clean up after each test
	afterEach(() => {
		cleanup();
		vi.resetAllMocks();
	});

	// Test 1: Verifies that BackButton renders with the default text
	test("renders BackButton with default text", () => {
		render(
			<MemoryRouter>
				<BackButton />
			</MemoryRouter>,
		);

		// Assert that the button is rendered with the default text
		const button = screen.getByRole("button", { name: /Go back/i });
		expect(button).toBeInTheDocument();
	});

	// Test 2: Verifies that BackButton renders with custom text
	test("renders BackButton with custom text", () => {
		const customText = "Back to Home";
		render(
			<MemoryRouter>
				<BackButton text={customText} />
			</MemoryRouter>,
		);

		// Assert that the button is rendered with the custom text
		const button = screen.getByRole("button", { name: new RegExp(customText, "i") });
		expect(button).toBeInTheDocument();
	});

	// Test 3: Verifies that clicking the button triggers navigation
	test("navigates back when clicked", () => {
		render(
			<MemoryRouter>
				<BackButton />
			</MemoryRouter>,
		);

		// Simulate a button click
		const button = screen.getByRole("button", { name: /Go back/i });
		fireEvent.click(button);

		// Assert that navigate(-1) is called
		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});

	// Test 4: Snapshot test for BackButton with default props
	test("matches snapshot with default props", () => {
		const { container } = render(
			<MemoryRouter>
				<BackButton />
			</MemoryRouter>,
		);

		// Assert that the rendered output matches the snapshot
		expect(container).toMatchSnapshot();
	});

	// Test 5: Snapshot test for BackButton with custom text
	test("matches snapshot with custom text", () => {
		const { container } = render(
			<MemoryRouter>
				<BackButton text="Custom Text" />
			</MemoryRouter>,
		);

		// Assert that the rendered output matches the snapshot
		expect(container).toMatchSnapshot();
	});
});
