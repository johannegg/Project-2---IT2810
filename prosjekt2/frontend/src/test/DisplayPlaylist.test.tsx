import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { PlaylistData } from "../pages/Playlists/Playlists";
import DisplayPlaylist from "../components/DisplayPlaylist/DisplayPlaylist";
import { makeVar } from "@apollo/client";
import { Artist, Genre } from "../utils/types/SongTypes";

const mockPlaylistsVar = makeVar<PlaylistData[]>([]);

// Override playlistsVar during tests
vi.mock('../../apollo/cache', () => ({
  playlistsVar: mockPlaylistsVar,
}));

describe('DisplayPlaylist Component', () => {
  it('renders correctly and matches snapshot', () => {
    // Mock artist and genre data
    const mockArtist: Artist = { id: 'a1', name: 'Artist 1' };
    const mockGenre: Genre = { name: 'pop' };

    // Mock playlist data
    const mockPlaylist: PlaylistData = {
      id: '1',
      name: 'My Playlist',
      backgroundcolor: '#ffffff',
      icon: '🎵',
      songs: [
        {
          id: 's1',
          title: 'Song 1',
          views: 1000,
          year: 2020,
          artist: mockArtist,
          genre: mockGenre,
          lyrics: 'Some lyrics for song 1',
        },
        {
          id: 's2',
          title: 'Song 2',
          views: 2000,
          year: 2021,
          artist: { id: 'a2', name: 'Artist 2' },
          genre: { name: 'rock' },
          lyrics: 'Some lyrics for song 2',
        },
      ],
    };

    // Set the value of playlistsVar
    mockPlaylistsVar([mockPlaylist]);

    // Render the component
    const { asFragment } = render(
      <DisplayPlaylist playlistId="1" onDelete={vi.fn()} />
    );

    // Assert the snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays "Playlist not found" when no playlist matches', () => {
    // Set playlistsVar to an empty array
    mockPlaylistsVar([]);

    // Render the component
    const { getByText } = render(
      <DisplayPlaylist playlistId="invalid" onDelete={vi.fn()} />
    );

    // Assert text
    expect(getByText('Playlist not found')).toBeInTheDocument();
  });

});