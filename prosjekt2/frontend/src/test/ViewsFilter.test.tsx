import { describe, test, vi, beforeEach, beforeAll, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { ViewsFilter } from "../components/ViewsFilter/ViewsFilter";
import { minViewsVar, maxViewsVar, clearFiltersVar } from "../apollo/cache";
import "@testing-library/jest-dom";

beforeAll(() => {
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

describe("ViewsFilter Component", () => {
	const mockOnViewsChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		sessionStorage.clear();
		minViewsVar(0);
		maxViewsVar(1000000);
		clearFiltersVar(false);
	});

	test("initializes with sessionStorage values", async () => {
		sessionStorage.setItem("minViews", "200");
		sessionStorage.setItem("maxViews", "800000");

		await act(async () => {
			render(<ViewsFilter onViewsChange={mockOnViewsChange} />);
		});

		expect(minViewsVar()).toBe(200);
		expect(maxViewsVar()).toBe(800000);

		expect(mockOnViewsChange).toHaveBeenCalledWith(200, 800000);
	});

	test("matches snapshot", async () => {
		const { container } = render(<ViewsFilter onViewsChange={mockOnViewsChange} />);

		expect(container).toMatchSnapshot();
	});
});
