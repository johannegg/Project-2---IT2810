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
        
        // Verify the input field and buttons are present
        const input = screen.getByLabelText(/search input field/i);
        expect(input).toBeInTheDocument();

        const searchButton = screen.getByLabelText(/submit search/i);
        expect(searchButton).toBeInTheDocument();

        // Snapshot the initial render
        expect(asFragment()).toMatchSnapshot();
    });

    test("accepts an initial search term", () => {
        const { asFragment } = render(<SearchBar setSearchTerm={setSearchTermMock} initialSearchTerm="Initial Value" />);
    
        // Verify the input field has the initial value
        const input = screen.getByLabelText(/search input field/i);
        expect(input).toHaveValue("Initial Value");

        // Snapshot the render with the initial value
        expect(asFragment()).toMatchSnapshot();
    });

    test("updates the input value as the user types", () => {
        const { asFragment } = render(<SearchBar setSearchTerm={setSearchTermMock} />);

        // Simulate typing in the input field
        const input = screen.getByLabelText(/search input field/i);
        fireEvent.change(input, { target: { value: "New Value" } });

        // Verify the input value has been updated
        expect(input).toHaveValue("New Value");

        // Snapshot the render after typing
        expect(asFragment()).toMatchSnapshot();
    });

    test("calls setSearchTerm when the form is submitted", () => {
        const { asFragment } = render(<SearchBar setSearchTerm={setSearchTermMock} />);

        // Simulate typing and form submission
        const input = screen.getByLabelText(/search input field/i);
        fireEvent.change(input, { target: { value: "Search Term" } });

        const form = screen.getByLabelText(/search form/i);
        fireEvent.submit(form);

        // Verify setSearchTerm is called with the correct value
        expect(setSearchTermMock).toHaveBeenCalledWith("Search Term");

        // Snapshot the render after submission
        expect(asFragment()).toMatchSnapshot();
    });

    test("clears the input when the clear button is clicked", () => {
        const { asFragment } = render(<SearchBar setSearchTerm={setSearchTermMock} initialSearchTerm="Clear Me" />);
    
        // Verify the clear button is present
        const clearButton = screen.getByLabelText(/clear search button/i);
        expect(clearButton).toBeInTheDocument();
    
        // Simulate clicking the clear button
        fireEvent.click(clearButton);
    
        // Verify the input is cleared
        const input = screen.getByLabelText(/search input field/i);
        expect(input).toHaveValue("");
    
        // Verify setSearchTerm is called with an empty string
        expect(setSearchTermMock).toHaveBeenCalledWith("");

        // Snapshot the render after clearing
        expect(asFragment()).toMatchSnapshot();
    });
});
