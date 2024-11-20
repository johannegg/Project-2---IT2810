import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";

import { isSidebarOpenVar, clearFiltersVar } from "../apollo/cache";
import { Sidebar } from "../components/SideBar/SideBar";

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

describe("Sidebar", () => {
	const mockOnGenreChange = vi.fn();
	const mockOnViewsChange = vi.fn();
	const mockOnSortChange = vi.fn();
	const mockOnToggle = vi.fn();
	const mockOnClearAllFilters = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
		isSidebarOpenVar(false);
		clearFiltersVar(false);
		cleanup();
	});

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

		expect(asFragment()).toMatchSnapshot();
	});

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

		expect(asFragment()).toMatchSnapshot();
	});

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

		const sidebar = screen.getByRole("complementary", { hidden: true });
		expect(sidebar).toHaveClass("sidebar");
		expect(sidebar).not.toHaveClass("open");
	});

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

		const closeButton = screen.getByRole("button", { name: /close/i, hidden: true });
		act(() => fireEvent.click(closeButton));

		expect(isSidebarOpenVar()).toBe(true);
		expect(mockOnToggle).toHaveBeenCalledWith(true);

		act(() => fireEvent.click(closeButton));

		expect(isSidebarOpenVar()).toBe(false);
		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});

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

		const clearFiltersButton = screen.getByRole("button", {
			name: /clear all filters/i,
			hidden: true,
		});
		fireEvent.click(clearFiltersButton);

		expect(mockOnClearAllFilters).toHaveBeenCalled();

		expect(clearFiltersVar()).toBe(false);
	});
});
