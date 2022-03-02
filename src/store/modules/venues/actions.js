import api from "@/api";

const getVenues = (context) => {
  api.getUrl(context, "/venues", "VENUES_UPDATED");
};

const getVenueList = (context) => {
  api.getUrl(context, "/venues-list", "VENUES_UPDATED");
};

const searchVenues = (context, filter) => {
  api.getUrl(context, "/venues?" + filter, "VENUES_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/venues-search?" + filter, "VENUES_UPDATED");
};

const getVenue = (context, id) => {
  api.getUrl(context, "/venues/" + id, "VENUE_UPDATED");
};

const createVenue = (context, payload) => {
  api.postUrl(context, "/venues", payload, "VENUE_UPDATED", {
    name: "VenuesIndex",
  });
};

const updateVenue = (context, payload) => {
  api.patchUrl(context, "/venues/" + payload.id, payload, "VENUE_UPDATED");
};

const mergeVenue = (context, payload) => {
  api.postUrl(
    context,
    "/venues-merge/" + payload.id,
    payload,
    "VENUE_UPDATED",
    {
      name: "VenuesIndex",
    }
  );
};

const deleteVenue = (context, id) => {
  api.deleteUrl(context, "/venues/" + id, "VENUE_RESET");
};

const resetVenue = (context) => {
  context.commit("VENUE_RESET");
};

const uploadPhoto = (context, payload) => {
  api.postUrl(
    context,
    "/venues-upload-photo/" + payload.getAll("id"),
    payload,
    "VENUE_UPDATED"
  );
};

export default {
  getVenues,
  getVenueList,
  searchVenues,
  searchFuzzy,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
  resetVenue,
  uploadPhoto,
  mergeVenue,
};
