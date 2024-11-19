import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { genreFilterVar, minViewsVar, maxViewsVar } from "../apollo/cache";
import { MockedProvider } from "@apollo/client/testing";
import { Filter } from "../components/GenreFilter/GenreFilter";

const mockUseGenreCounts = vi.fn();

vi.mock("../utils/hooks/useGenreCounts", () => ({
  useGenreCounts: () => mockUseGenreCounts(),
}));

vi.mock("@apollo/client", async () => {
  const actual = await vi.importActual("@apollo/client");
  return {
    ...actual,
    useReactiveVar: (variable: any) => variable(),
  };
});

describe("Filter Component", () => {
  let onGenreChangeMock: Mock<(selectedGenres: string[]) => void>;

  beforeEach(() => {
    onGenreChangeMock = vi.fn();
    genreFilterVar([]);
    minViewsVar(0);
    maxViewsVar(1000);
    mockUseGenreCounts.mockReset();
  });

  it("does not render checkboxes while loading", () => {
    mockUseGenreCounts.mockImplementation(() => ({
      genreCounts: [],
      isLoading: true,
      error: undefined,
      refetch: vi.fn(),
    }));

    render(
      <MockedProvider>
        <Filter onGenreChange={onGenreChangeMock} searchTerm="" />
      </MockedProvider>
    );

    const countryCheckbox = screen.queryByLabelText(/Country/);
    expect(countryCheckbox).not.toBeInTheDocument();
  });

  it("renders genres correctly", async () => {
    mockUseGenreCounts.mockImplementation(() => ({
      genreCounts: [
        { name: "Country", count: 59 },
        { name: "Pop", count: 990 },
        { name: "Rap", count: 1246 },
        { name: "Rb", count: 147 },
        { name: "Rock", count: 505 },
      ],
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    }));

    render(
      <MockedProvider>
        <Filter onGenreChange={onGenreChangeMock} searchTerm="example" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Country/)).toBeInTheDocument();
      expect(screen.getByText(/Pop/)).toBeInTheDocument();
      expect(screen.getByText(/Rap/)).toBeInTheDocument();
      expect(screen.getByText(/Rb/)).toBeInTheDocument();
      expect(screen.getByText(/Rock/)).toBeInTheDocument();
    });
  });
});
