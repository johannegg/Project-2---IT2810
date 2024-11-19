import { render, act } from "@testing-library/react";
import { ViewsFilter } from "../components/ViewsFilter/ViewsFilter";
import { minViewsVar, maxViewsVar, clearFiltersVar } from "../apollo/cache";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock ResizeObserver to prevent errors during testing
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("ViewsFilter Component", () => {
  // Mock function to simulate the onViewsChange callback
  const mockOnViewsChange = vi.fn();

  // Reset mocks, sessionStorage, and reactive variables before each test
  beforeEach(() => {
    vi.clearAllMocks(); 
    sessionStorage.clear(); 
    minViewsVar(0); 
    maxViewsVar(1000000); 
    clearFiltersVar(false); 
  });

  // Test that ViewsFilter initializes correctly with sessionStorage values
  test("initializes with sessionStorage values", async () => {
    // Set initial values in sessionStorage
    sessionStorage.setItem("minViews", "200");
    sessionStorage.setItem("maxViews", "800000");

    // Render the ViewsFilter component and wrap it in an act block to handle updates
    await act(async () => {
      render(<ViewsFilter onViewsChange={mockOnViewsChange} />);
    });

    // Assert that reactive variables match sessionStorage values
    expect(minViewsVar()).toBe(200);
    expect(maxViewsVar()).toBe(800000);

    // Assert that the mock callback was called with the correct arguments
    expect(mockOnViewsChange).toHaveBeenCalledWith(200, 800000);
  });

  // Test that ViewsFilter matches the saved snapshot
  test("matches snapshot", async () => {
    // Render the ViewsFilter component
    const { container } = render(<ViewsFilter onViewsChange={mockOnViewsChange} />);

    // Assert that the rendered HTML matches the stored snapshot
    expect(container).toMatchSnapshot();
  });
});
