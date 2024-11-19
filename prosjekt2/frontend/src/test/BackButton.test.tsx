import React from "react";
import { describe, test, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import BackButton from "../components/BackButton/BackButton";
import { MemoryRouter } from "react-router-dom";

// Mock implementation of useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(),
	};
});

import { useNavigate } from "react-router-dom";

describe("BackButton", () => {
	const mockNavigate = vi.fn();

	// Set up mock before each test
	beforeEach(() => {
		vi.mocked(useNavigate).mockReturnValue(mockNavigate);
	});

	// Clean up after each test
	afterEach(() => {
		cleanup();
		vi.resetAllMocks();
	});

	test("renders BackButton with default text", () => {
		render(
			<MemoryRouter>
				<BackButton />
			</MemoryRouter>
		);

		const button = screen.getByRole("button", { name: /Go back/i });
		expect(button).toBeInTheDocument();
	});

	test("renders BackButton with custom text", () => {
		const customText = "Back to Home";
		render(
			<MemoryRouter>
				<BackButton text={customText} />
			</MemoryRouter>
		);

		const button = screen.getByRole("button", { name: new RegExp(customText, "i") });
		expect(button).toBeInTheDocument();
	});

	test("navigates back when clicked", () => {
		render(
			<MemoryRouter>
				<BackButton />
			</MemoryRouter>
		);

		const button = screen.getByRole("button", { name: /Go back/i });
		fireEvent.click(button);

		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});

	test("matches snapshot with default props", () => {
		const { container } = render(
			<MemoryRouter>
				<BackButton />
			</MemoryRouter>
		);

		expect(container).toMatchSnapshot();
	});

	test("matches snapshot with custom text", () => {
		const { container } = render(
			<MemoryRouter>
				<BackButton text="Custom Text" />
			</MemoryRouter>
		);
		
		expect(container).toMatchSnapshot();
	});
});
