import { describe, test, vi, afterEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Sort from "../components/Sort/Sort";

describe("Sort", () => {
	const mockOnSortChange = vi.fn();

	afterEach(() => {
		cleanup();
		vi.resetAllMocks();
	});

	test("renders Sort with default sort option", () => {
		render(<Sort songs={[]} sortOption="title_asc" onSortChange={mockOnSortChange} />);

		expect(screen.getByText("Sort by")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toHaveValue("title_asc");
	});

	test("renders all sort options", () => {
		render(<Sort songs={[]} sortOption="title_asc" onSortChange={mockOnSortChange} />);

		expect(screen.getByRole("option", { name: "Sort by title A to Z" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Sort by title Z to A" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Sort by artist A to Z" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Sort by artist Z to A" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Sort by views descending" })).toBeInTheDocument();
	});

	test("calls onSortChange when a new sort option is selected", () => {
		render(<Sort songs={[]} sortOption="title_asc" onSortChange={mockOnSortChange} />);

		const select = screen.getByRole("combobox");
		fireEvent.change(select, { target: { value: "title_desc" } });
		expect(mockOnSortChange).toHaveBeenCalledWith("title_desc");
	});

	test("renders Sort with a different sort option", () => {
		render(<Sort songs={[]} sortOption="artist_desc" onSortChange={mockOnSortChange} />);

		expect(screen.getByRole("combobox")).toHaveValue("artist_desc");
	});

	test("matches snapshot with default sort option", () => {
		const { container } = render(
			<Sort songs={[]} sortOption="title_asc" onSortChange={mockOnSortChange} />,
		);

		expect(container).toMatchSnapshot();
	});

	test("matches snapshot with a different sort option", () => {
		const { container } = render(
			<Sort songs={[]} sortOption="views_desc" onSortChange={mockOnSortChange} />,
		);

		expect(container).toMatchSnapshot();
	});
});
