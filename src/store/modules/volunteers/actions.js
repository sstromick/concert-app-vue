import api from "@/api";

const getVolunteers = (context) => {
  api.getUrl(context, "/volunteers", "VOLUNTEERS_UPDATED");
};

const getVolunteerList = (context) => {
  api.getUrl(context, "/volunteers-list", "VOLUNTEERS_UPDATED");
};

const searchVolunteers = (context, filter) => {
  api.getUrl(context, "/volunteers?" + filter, "VOLUNTEERS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/volunteers-search?" + filter, "VOLUNTEERS_UPDATED");
};

const getPendingVolunteers = (context, filter) => {
  api.getUrl(context, "/volunteers-pending?" + filter, "VOLUNTEERS_UPDATED");
};

const getVolunteer = (context, id) => {
  api.getUrl(context, "/volunteers/" + id, "VOLUNTEER_UPDATED");
};

const createVolunteer = (context, payload) => {
  api.postUrl(context, "/volunteers", payload, "VOLUNTEER_UPDATED", {
    name: "VolunteersIndex",
  });
};

const updateVolunteer = (context, payload) => {
  api.patchUrl(
    context,
    "/volunteers/" + payload.id,
    payload,
    "VOLUNTEER_UPDATED"
  );
};

const mergeVolunteer = (context, payload) => {
  api.postUrl(
    context,
    "/volunteers-merge/" + payload.id,
    payload,
    "VOLUNTEER_UPDATED",
    {
      name: "VolunteersIndex",
    }
  );
};

const deleteVolunteer = (context, id) => {
  api.deleteUrl(context, "/volunteers/" + id, "VOLUNTEER_RESET");
};

const resetVolunteer = (context) => {
  context.commit("VOLUNTEER_RESET");
};

const uploadPhoto = (context, payload) => {
  api.postUrl(
    context,
    "/volunteers-upload-photo/" + payload.getAll("id"),
    payload,
    "VOLUNTEER_UPDATED"
  );
};

export default {
  getVolunteers,
  getVolunteerList,
  searchVolunteers,
  searchFuzzy,
  getPendingVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  resetVolunteer,
  uploadPhoto,
  mergeVolunteer,
};
