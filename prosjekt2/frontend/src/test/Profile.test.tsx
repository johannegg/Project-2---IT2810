import React from "react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Profile from "../components/Profile/Profile";
import { favoriteSongsVar, playlistsVar } from "../apollo/cache";
import { CREATE_USER } from "../utils/Queries";

// Mock `useNavigate` from react-router-dom
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(), 
}));

// Test suite for the Profile component
describe("Profile Component", () => {
    const mockUsername = "testUser";

    // Mock response for the CREATE_USER mutation
    const mockCreateUserResult = {
        request: {
            query: CREATE_USER,
            variables: { username: mockUsername }, 
        },
        result: {
            data: {
                createUser: {
                    username: mockUsername, 
                    favoriteSongs: [], 
                },
            },
        },
    };

    // Before each test, clear local storage and reset all mocks
    beforeEach(() => {
        localStorage.clear();
        vi.resetAllMocks(); 
    });

    // Snapshot Tests
    test("matches snapshot when user is not logged in", () => {
        const { container } = render(
            <MockedProvider>
                <Profile />
            </MockedProvider>
        );
        expect(container).toMatchSnapshot();
    });

    test("matches snapshot when login overlay is displayed", () => {
        const { container } = render(
            <MockedProvider>
                <Profile />
            </MockedProvider>
        );

        // Simulate clicking on the profile icon to open the login overlay
        const profileIcon = screen.getByRole("button", { name: /profile icon/i });
        fireEvent.click(profileIcon);

        expect(container).toMatchSnapshot();
    });

    test("matches snapshot when user is logged in", async () => {
        localStorage.setItem("profileName", mockUsername);

        const { container } = render(
            <MockedProvider>
                <Profile />
            </MockedProvider>
        );

        // Wait for the logged-in state to update
        await waitFor(() => {
            expect(screen.getByText(`You're logged in as "${mockUsername}"`)).toBeInTheDocument();
        });

        expect(container).toMatchSnapshot();
    });

    // Test to verify that the Profile component renders correctly when the user is not logged in
    test("renders login state by default", () => {
        render(
            <MockedProvider>
                <Profile />
            </MockedProvider>
        );

        // Check if the profile icon is rendered
        const profileIcon = screen.getByRole("button", { name: /profile icon/i });
        expect(profileIcon).toBeInTheDocument();

        // Verify that the logged-in message is not displayed
        expect(screen.queryByText(/you're logged in as/i)).not.toBeInTheDocument();
    });

    // Test to check that the login overlay is displayed when the profile icon is clicked
    test("displays login overlay when profile icon is clicked", () => {
        render(
            <MockedProvider>
                <Profile />
            </MockedProvider>
        );

        // Simulate clicking on the profile icon
        const profileIcon = screen.getByRole("button", { name: /profile icon/i });
        fireEvent.click(profileIcon);

        // Verify that the login overlay with the login prompt is displayed
        expect(screen.getByText(/choose a unique username/i)).toBeInTheDocument();
    });

    // Test to ensure a user can log in successfully
    test("logs in a user successfully", async () => {
        render(
            <MockedProvider mocks={[mockCreateUserResult]} addTypename={false}>
                <Profile />
            </MockedProvider>
        );

        // Simulate opening the login overlay
        const profileIcon = screen.getByRole("button", { name: /profile icon/i });
        fireEvent.click(profileIcon);

        // Input the mock username
        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        fireEvent.change(usernameInput, { target: { value: mockUsername } });

        // Submit the login form
        const submitButton = screen.getByRole("button", { name: /submit login/i });
        fireEvent.click(submitButton);

        // Wait for the logged-in state to update
        await waitFor(() => {
            expect(screen.getByText(`You're logged in as "${mockUsername}"`)).toBeInTheDocument();
        });

        // Verify that the username is stored in local storage
        expect(localStorage.getItem("profileName")).toBe(mockUsername);

        // Check that the Apollo reactive variables are updated
        expect(favoriteSongsVar()).toEqual([]);
    });

    // Test to verify that an error message is displayed when login fails
    test("displays an error if login fails", async () => {
        const mockErrorResult = {
            request: {
                query: CREATE_USER,
                variables: { username: mockUsername },
            },
            error: new Error("User creation failed"), 
        };

        render(
            <MockedProvider mocks={[mockErrorResult]} addTypename={false}>
                <Profile />
            </MockedProvider>
        );

        // Simulate opening the login overlay
        const profileIcon = screen.getByRole("button", { name: /profile icon/i });
        fireEvent.click(profileIcon);

        // Input the mock username
        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        fireEvent.change(usernameInput, { target: { value: mockUsername } });

        // Submit the login form
        const submitButton = screen.getByRole("button", { name: /submit login/i });
        fireEvent.click(submitButton);

        // Wait for the error message to appear
        await waitFor(() => {
            expect(screen.getByText(/user creation failed/i)).toBeInTheDocument();
        });
    });

    // Test to ensure a user can log out successfully
    test("logs out the user successfully", () => {
        localStorage.setItem("profileName", mockUsername);

        render(
            <MockedProvider>
                <Profile />
            </MockedProvider>
        );

        // Verify the logged-in message is displayed
        expect(screen.getByText(`You're logged in as "${mockUsername}"`)).toBeInTheDocument();

        // Simulate clicking the log-out button
        const logoutButton = screen.getByRole("button", { name: /log out/i });
        fireEvent.click(logoutButton);

        // Verify the logged-in message is no longer displayed
        expect(screen.queryByText(`You're logged in as "${mockUsername}"`)).not.toBeInTheDocument();

        // Check that local storage is cleared
        expect(localStorage.getItem("profileName")).toBeNull();

        // Verify that the Apollo reactive variables are reset
        expect(favoriteSongsVar()).toEqual([]);
        expect(playlistsVar()).toEqual([]);
    });
});