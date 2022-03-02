import api from "@/api";

const getArtists = (context) => {
  api.getUrl(context, "/artists", "ARTISTS_UPDATED");
};

const getArtistList = (context) => {
  api.getUrl(context, "/artists-list", "ARTISTS_UPDATED");
};

const getArtist = (context, id) => {
  api.getUrl(context, "/artists/" + id, "ARTIST_UPDATED");
};

const searchArtists = (context, filter) => {
  api.getUrl(context, "/artists?" + filter, "ARTISTS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/artists-search?" + filter, "ARTISTS_UPDATED");
};

const createArtist = (context, payload) => {
  api.postUrl(context, "/artists", payload, "ARTIST_UPDATED", {
    name: "ArtistsIndex",
  });
};

const updateArtist = (context, payload) => {
  api.patchUrl(context, "/artists/" + payload.id, payload, "ARTIST_UPDATED");
};

const deleteArtist = (context, id) => {
  api.deleteUrl(context, "/artists/" + id, "ARTIST_RESET");
};

const resetArtist = (context) => {
  context.commit("ARTIST_RESET");
};

const uploadPhoto = (context, payload) => {
  api.postUrl(context, "/artists-upload-photo/" + payload.getAll('id'), payload, "ARTIST_UPDATED");
};

export default {
  getArtists,
  getArtistList,
  getArtist,
  searchArtists,
  searchFuzzy,
  createArtist,
  updateArtist,
  deleteArtist,
  resetArtist,
  uploadPhoto
};
