import React from "react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";

import { isSidebarOpenVar, clearFiltersVar } from "../apollo/cache";
import { Sidebar } from "../components/SideBar/SideBar";

// Mock dependencies for child components to simplify testing
vi.mock("../components/GenreFilter/GenreFilter", () => ({
  Filter: ({ onGenreChange }: { onGenreChange: (genres: string[]) => void }) => (
    <div data-testid="genre-filter" onClick={() => onGenreChange(["Pop"])}>Genre Filter</div>
  ),
}));
vi.mock("../components/ViewsFilter/ViewsFilter", () => ({
  ViewsFilter: ({ onViewsChange }: { onViewsChange: (min: number, max: number) => void }) => (
    <div data-testid="views-filter" onClick={() => onViewsChange(100, 1000)}>Views Filter</div>
  ),
}));
vi.mock("../components/Sort/Sort", () => ({
  default: ({ onSortChange }: { onSortChange: (newSort: string) => void }) => (
    <div data-testid="sort" onClick={() => onSortChange("title_asc")}>Sort</div>
  ),
}));

// Describe the test suite for the Sidebar component
describe("Sidebar", () => {
  // Mock functions for the props
  const mockOnGenreChange = vi.fn();
  const mockOnViewsChange = vi.fn();
  const mockOnSortChange = vi.fn();
  const mockOnToggle = vi.fn();
  const mockOnClearAllFilters = vi.fn();

  // Before each test, reset mocks and cleanup the DOM
  beforeEach(() => {
    vi.resetAllMocks(); 
    isSidebarOpenVar(false); 
    clearFiltersVar(false); 
    cleanup(); 
  });

  // Test 1: Verifies the Sidebar renders in a closed state by default
  test("renders Sidebar in closed state by default", () => {
    // Render the Sidebar component
    render(
      <Sidebar
        onGenreChange={mockOnGenreChange}
        onViewsChange={mockOnViewsChange}
        onSortChange={mockOnSortChange}
        onToggle={mockOnToggle}
        onClearAllFilters={mockOnClearAllFilters}
        searchTerm=""
        songs={[]}
      />
    );

    // Find the Sidebar element using the role and check its classes
    const sidebar = screen.getByRole("complementary", { hidden: true });
    expect(sidebar).toHaveClass("sidebar"); // Ensure it has the correct base class
    expect(sidebar).not.toHaveClass("open"); // Ensure it does not have the "open" class
  });

  // Test 2: Verifies the Sidebar toggles between open and closed states
  test("toggles Sidebar open and closed", () => {
    // Render the Sidebar component
    render(
      <Sidebar
        onGenreChange={mockOnGenreChange}
        onViewsChange={mockOnViewsChange}
        onSortChange={mockOnSortChange}
        onToggle={mockOnToggle}
        onClearAllFilters={mockOnClearAllFilters}
        searchTerm=""
        songs={[]}
      />
    );

    // Find the Close button and simulate a click to open the Sidebar
    const closeButton = screen.getByRole("button", { name: /close/i, hidden: true });
    act(() => fireEvent.click(closeButton));

    // Assert the Sidebar state is now open and the callback was called
    expect(isSidebarOpenVar()).toBe(true);
    expect(mockOnToggle).toHaveBeenCalledWith(true);

    // Simulate another click to close the Sidebar
    act(() => fireEvent.click(closeButton));

    // Assert the Sidebar state is now closed and the callback was called
    expect(isSidebarOpenVar()).toBe(false);
    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  // Test 3: Verifies the Clear Filters button clears all filters
  test("clears all filters when Clear Filters button is clicked", () => {
    // Render the Sidebar component
    render(
      <Sidebar
        onGenreChange={mockOnGenreChange}
        onViewsChange={mockOnViewsChange}
        onSortChange={mockOnSortChange}
        onToggle={mockOnToggle}
        onClearAllFilters={mockOnClearAllFilters}
        searchTerm=""
        songs={[]}
      />
    );

    // Find the Clear Filters button and simulate a click
    const clearFiltersButton = screen.getByRole("button", { name: /clear filters/i, hidden: true });
    fireEvent.click(clearFiltersButton);

    // Assert the clear filters callback was called
    expect(mockOnClearAllFilters).toHaveBeenCalled();

    // Assert the clearFiltersVar state was reset
    expect(clearFiltersVar()).toBe(false);
  });
});
