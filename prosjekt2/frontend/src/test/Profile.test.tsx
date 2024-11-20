import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Profile from "../components/Profile/Profile";
import { favoriteSongsVar, playlistsVar } from "../apollo/cache";
import { CREATE_USER } from "../utils/Queries";

vi.mock("react-router-dom", () => ({
	useNavigate: () => vi.fn(),
}));

describe("Profile Component", () => {
	const mockUsername = "testUser";

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

	beforeEach(() => {
		localStorage.clear();
		vi.resetAllMocks();
	});

	test("matches snapshot when user is not logged in", () => {
		const { container } = render(
			<MockedProvider>
				<Profile />
			</MockedProvider>,
		);
		expect(container).toMatchSnapshot();
	});

	test("matches snapshot when login overlay is displayed", () => {
		const { container } = render(
			<MockedProvider>
				<Profile />
			</MockedProvider>,
		);

		const profileIcon = screen.getByRole("button", { name: /profile icon/i });
		fireEvent.click(profileIcon);

		expect(container).toMatchSnapshot();
	});

	test("matches snapshot when user is logged in", async () => {
		localStorage.setItem("profileName", mockUsername);

		const { container } = render(
			<MockedProvider>
				<Profile />
			</MockedProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText(`You're logged in as "${mockUsername}"`)).toBeInTheDocument();
		});

		expect(container).toMatchSnapshot();
	});

	test("renders login state by default", () => {
		render(
			<MockedProvider>
				<Profile />
			</MockedProvider>,
		);

		const profileIcon = screen.getByRole("button", { name: /profile icon/i });
		expect(profileIcon).toBeInTheDocument();

		expect(screen.queryByText(/you're logged in as/i)).not.toBeInTheDocument();
	});

	test("displays login overlay when profile icon is clicked", () => {
		render(
			<MockedProvider>
				<Profile />
			</MockedProvider>,
		);

		const profileIcon = screen.getByRole("button", { name: /profile icon/i });
		fireEvent.click(profileIcon);

		expect(screen.getByText(/choose a unique username/i)).toBeInTheDocument();
	});

	test("logs in a user successfully", async () => {
		render(
			<MockedProvider mocks={[mockCreateUserResult]} addTypename={false}>
				<Profile />
			</MockedProvider>,
		);

		const profileIcon = screen.getByRole("button", { name: /profile icon/i });
		fireEvent.click(profileIcon);

		const usernameInput = screen.getByPlaceholderText(/enter username/i);
		fireEvent.change(usernameInput, { target: { value: mockUsername } });

		const submitButton = screen.getByRole("button", { name: /submit login/i });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(`You're logged in as "${mockUsername}"`)).toBeInTheDocument();
		});

		expect(localStorage.getItem("profileName")).toBe(mockUsername);

		expect(favoriteSongsVar()).toEqual([]);
	});

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
			</MockedProvider>,
		);

		const profileIcon = screen.getByRole("button", { name: /profile icon/i });
		fireEvent.click(profileIcon);

		const usernameInput = screen.getByPlaceholderText(/enter username/i);
		fireEvent.change(usernameInput, { target: { value: mockUsername } });

		const submitButton = screen.getByRole("button", { name: /submit login/i });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/user creation failed/i)).toBeInTheDocument();
		});
	});

	test("logs out the user successfully", () => {
		localStorage.setItem("profileName", mockUsername);

		render(
			<MockedProvider>
				<Profile />
			</MockedProvider>,
		);

		expect(screen.getByText(`You're logged in as "${mockUsername}"`)).toBeInTheDocument();

		const logoutButton = screen.getByRole("button", { name: /log out/i });
		fireEvent.click(logoutButton);

		expect(screen.queryByText(`You're logged in as "${mockUsername}"`)).not.toBeInTheDocument();
		expect(localStorage.getItem("profileName")).toBeNull();

		expect(favoriteSongsVar()).toEqual([]);
		expect(playlistsVar()).toEqual([]);
	});
});
