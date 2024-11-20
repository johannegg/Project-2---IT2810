import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";

import { isSidebarOpenVar, clearFiltersVar } from "../apollo/cache";
import { Sidebar } from "../components/SideBar/SideBar";

// Mock dependencies for child components to simplify testing
vi.mock("../components/GenreFilter/GenreFilter", () => ({
	Filter: ({ onGenreChange }: { onGenreChange: (genres: string[]) => void }) => (
		<div data-testid="genre-filter" onClick={() => onGenreChange(["Pop"])}>
			Genre Filter
		</div>
	),
}));
vi.mock("../components/ViewsFilter/ViewsFilter", () => ({
	ViewsFilter: ({ onViewsChange }: { onViewsChange: (min: number, max: number) => void }) => (
		<div data-testid="views-filter" onClick={() => onViewsChange(100, 1000)}>
			Views Filter
		</div>
	),
}));
vi.mock("../components/Sort/Sort", () => ({
	default: ({ onSortChange }: { onSortChange: (newSort: string) => void }) => (
		<div data-testid="sort" onClick={() => onSortChange("title_asc")}>
			Sort
		</div>
	),
}));

// Describe the test suite for the Sidebar component
describe("Sidebar", () => {
	// Mock functions to simulate the behavior of the props
	const mockOnGenreChange = vi.fn();
	const mockOnViewsChange = vi.fn();
	const mockOnSortChange = vi.fn();
	const mockOnToggle = vi.fn();
	const mockOnClearAllFilters = vi.fn();

	// Before each test, reset all mocks, variables, and clean up the DOM
	beforeEach(() => {
		vi.resetAllMocks();
		isSidebarOpenVar(false);
		clearFiltersVar(false);
		cleanup();
	});

	// Snapshot Test: Verifies the default rendering of Sidebar in a closed state
	test("matches snapshot when Sidebar is closed by default", () => {
		const { asFragment } = render(
			<Sidebar
				onGenreChange={mockOnGenreChange}
				onViewsChange={mockOnViewsChange}
				onSortChange={mockOnSortChange}
				onToggle={mockOnToggle}
				onClearAllFilters={mockOnClearAllFilters}
				searchTerm=""
				songs={[]}
			/>,
		);

		// Ensure that the rendered Sidebar matches the stored snapshot
		expect(asFragment()).toMatchSnapshot();
	});

	// Snapshot Test: Verifies the rendering of Sidebar when it is open
	test("matches snapshot when Sidebar is open", () => {
		isSidebarOpenVar(true);

		const { asFragment } = render(
			<Sidebar
				onGenreChange={mockOnGenreChange}
				onViewsChange={mockOnViewsChange}
				onSortChange={mockOnSortChange}
				onToggle={mockOnToggle}
				onClearAllFilters={mockOnClearAllFilters}
				searchTerm=""
				songs={[]}
			/>,
		);

		// Ensure that the rendered Sidebar matches the stored snapshot
		expect(asFragment()).toMatchSnapshot();
	});

	// Test: Verifies the Sidebar renders in a closed state by default
	test("renders Sidebar in closed state by default", () => {
		render(
			<Sidebar
				onGenreChange={mockOnGenreChange}
				onViewsChange={mockOnViewsChange}
				onSortChange={mockOnSortChange}
				onToggle={mockOnToggle}
				onClearAllFilters={mockOnClearAllFilters}
				searchTerm=""
				songs={[]}
			/>,
		);

		// Select the Sidebar element and verify its initial class states
		const sidebar = screen.getByRole("complementary", { hidden: true });
		expect(sidebar).toHaveClass("sidebar");
		expect(sidebar).not.toHaveClass("open");
	});

	// Test: Verifies the Sidebar toggles between open and closed states
	test("toggles Sidebar open and closed", () => {
		render(
			<Sidebar
				onGenreChange={mockOnGenreChange}
				onViewsChange={mockOnViewsChange}
				onSortChange={mockOnSortChange}
				onToggle={mockOnToggle}
				onClearAllFilters={mockOnClearAllFilters}
				searchTerm=""
				songs={[]}
			/>,
		);

		// Find the Close button and simulate a click to open the Sidebar
		const closeButton = screen.getByRole("button", { name: /close/i, hidden: true });
		act(() => fireEvent.click(closeButton));

		// Assert the Sidebar state is now open and the onToggle callback was called
		expect(isSidebarOpenVar()).toBe(true);
		expect(mockOnToggle).toHaveBeenCalledWith(true);

		// Simulate another click to close the Sidebar
		act(() => fireEvent.click(closeButton));

		// Assert the Sidebar state is now closed and the onToggle callback was called
		expect(isSidebarOpenVar()).toBe(false);
		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});

	// Test: Verifies the Clear Filters button clears all filters
	test("clears all filters when Clear Filters button is clicked", () => {
		render(
			<Sidebar
				onGenreChange={mockOnGenreChange}
				onViewsChange={mockOnViewsChange}
				onSortChange={mockOnSortChange}
				onToggle={mockOnToggle}
				onClearAllFilters={mockOnClearAllFilters}
				searchTerm=""
				songs={[]}
			/>,
		);

		// Find the Clear Filters button and simulate a click
		const clearFiltersButton = screen.getByRole("button", { name: /clear all filters/i, hidden: true });
		fireEvent.click(clearFiltersButton);

		// Assert the onClearAllFilters callback was called
		expect(mockOnClearAllFilters).toHaveBeenCalled();

		// Assert the clearFiltersVar reactive variable state was reset
		expect(clearFiltersVar()).toBe(false);
	});
});
