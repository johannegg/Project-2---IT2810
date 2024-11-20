import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "../components/SearchBar/SearchBar";

describe("SearchBar Component", () => {
	let setSearchTermMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		setSearchTermMock = vi.fn();
	});

	test("renders the SearchBar component", () => {
		const { asFragment } = render(<SearchBar setSearchTerm={setSearchTermMock} />);

		const input = screen.getByLabelText(/search input field/i);
		expect(input).toBeInTheDocument();

		const searchButton = screen.getByLabelText(/submit search/i);
		expect(searchButton).toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});

	test("accepts an initial search term", () => {
		const { asFragment } = render(
			<SearchBar setSearchTerm={setSearchTermMock} initialSearchTerm="Initial Value" />,
		);

		const input = screen.getByLabelText(/search input field/i);
		expect(input).toHaveValue("Initial Value");

		expect(asFragment()).toMatchSnapshot();
	});

	test("updates the input value as the user types", () => {
		const { asFragment } = render(<SearchBar setSearchTerm={setSearchTermMock} />);

		const input = screen.getByLabelText(/search input field/i);
		fireEvent.change(input, { target: { value: "New Value" } });

		expect(input).toHaveValue("New Value");

		expect(asFragment()).toMatchSnapshot();
	});

	test("calls setSearchTerm when the form is submitted", () => {
		const { asFragment } = render(<SearchBar setSearchTerm={setSearchTermMock} />);

		const input = screen.getByLabelText(/search input field/i);
		fireEvent.change(input, { target: { value: "Search Term" } });

		const form = screen.getByLabelText(/search form/i);
		fireEvent.submit(form);

		expect(setSearchTermMock).toHaveBeenCalledWith("Search Term");

		expect(asFragment()).toMatchSnapshot();
	});

	test("clears the input when the clear button is clicked", () => {
		const { asFragment } = render(
			<SearchBar setSearchTerm={setSearchTermMock} initialSearchTerm="Clear Me" />,
		);

		const clearButton = screen.getByLabelText(/clear search button/i);
		expect(clearButton).toBeInTheDocument();

		fireEvent.click(clearButton);

		const input = screen.getByLabelText(/search input field/i);
		expect(input).toHaveValue("");

		expect(setSearchTermMock).toHaveBeenCalledWith("");

		expect(asFragment()).toMatchSnapshot();
	});
});
