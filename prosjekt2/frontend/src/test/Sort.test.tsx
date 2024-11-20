import { describe, test, vi, afterEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Sort from "../components/Sort/Sort";

describe("Sort", () => {
	const mockOnSortChange = vi.fn(); // Mock function for onSortChange

	// Clean up after each test
	afterEach(() => {
		cleanup();
		vi.resetAllMocks();
	});

	// Test 1: Verifies that Sort renders correctly with default sort option
	test("renders Sort with default sort option", () => {
		render(<Sort songs={[]} sortOption="title_asc" onSortChange={mockOnSortChange} />);

		// Assert that the header and select element are rendered
		expect(screen.getByText("Sort by")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toHaveValue("title_asc");
	});

	// Test 2: Verifies that the sort options are rendered
	test("renders all sort options", () => {
		render(<Sort songs={[]} sortOption="title_asc" onSortChange={mockOnSortChange} />);
	
		// Assert that all options are present and match the aria-labels
		expect(screen.getByRole("option", { name: "Sort by title A to Z" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Sort by title Z to A" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Sort by artist A to Z" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Sort by artist Z to A" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: "Sort by views descending" })).toBeInTheDocument();
	});
	

	// Test 3: Verifies that onSortChange is called when a new sort option is selected
	test("calls onSortChange when a new sort option is selected", () => {
		render(<Sort songs={[]} sortOption="title_asc" onSortChange={mockOnSortChange} />);

		// Simulate changing the sort option
		const select = screen.getByRole("combobox");
		fireEvent.change(select, { target: { value: "title_desc" } });

		// Assert that the mock function is called with the new sort option
		expect(mockOnSortChange).toHaveBeenCalledWith("title_desc");
	});

	// Test 4: Verifies that Sort renders correctly with a different sort option
	test("renders Sort with a different sort option", () => {
		render(<Sort songs={[]} sortOption="artist_desc" onSortChange={mockOnSortChange} />);

		// Assert that the selected value is correctly set
		expect(screen.getByRole("combobox")).toHaveValue("artist_desc");
	});

	// Test 5: Snapshot test for Sort with default sort option
	test("matches snapshot with default sort option", () => {
		const { container } = render(
			<Sort songs={[]} sortOption="title_asc" onSortChange={mockOnSortChange} />,
		);

		// Assert that the rendered output matches the snapshot
		expect(container).toMatchSnapshot();
	});

	// Test 6: Snapshot test for Sort with a different sort option
	test("matches snapshot with a different sort option", () => {
		const { container } = render(
			<Sort songs={[]} sortOption="views_desc" onSortChange={mockOnSortChange} />,
		);

		// Assert that the rendered output matches the snapshot
		expect(container).toMatchSnapshot();
	});
});
