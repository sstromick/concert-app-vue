const ARTISTS_UPDATED = (state, artists) => {
  state.artists = artists.data;
};

const ARTIST_UPDATED = (state, artist) => {
  state.artist = artist.data;
};

const ARTIST_RESET = (state, artist) => {
  state.artist = null;
  state.artists.data = state.artists.data.filter(function(item) {
    return item.id != artist.id;
  });
};

export default {
  ARTISTS_UPDATED,
  ARTIST_UPDATED,
  ARTIST_RESET,
};
