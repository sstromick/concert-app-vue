import api from "@/api";

const getVolunteerShifts = (context) => {
  api.getUrl(context, "/volunteershifts", "VOLUNTEER_SHIFTS_UPDATED");
};

const getVolunteerShiftsByVolunteer = (context, filter) => {
  api.getUrl(
    context,
    "/volunteershifts-getshifts?" + filter,
    "VOLUNTEER_SHIFTS_UPDATED"
  );
};

const getPending = (context) => {
  api.getUrl(context, "/volunteershifts-pending?", "VOLUNTEER_SHIFTS_UPDATED");
};

const searchPending = (context, filter) => {
  api.getUrl(
    context,
    "/volunteershifts-pending?" + filter,
    "VOLUNTEER_SHIFTS_UPDATED"
  );
};

const searchVolunteerShifts = (context, filter) => {
  api.getUrl(context, "/volunteershifts?" + filter, "VOLUNTEER_SHIFTS_UPDATED");
};

const getVolunteerShift = (context, id) => {
  api.getUrl(context, "/volunteershifts/" + id, "VOLUNTEER_SHIFT_UPDATED");
};

const createVolunteerShift = (context, payload) => {
  api.postUrl(context, "/volunteershifts", payload, "VOLUNTEER_SHIFT_UPDATED", {
    name: "VolunteerShiftShow",
    params: "id",
  });
};

const updateShiftsStatus = (context, payload) => {
  api.postUrl(
    context,
    "/volunteershifts-update-status",
    payload,
    "VOLUNTEER_SHIFT_UPDATED"
  );
};

const updateShiftsPendingStatus = (context, payload) => {
  api.postUrl(
    context,
    "/volunteershifts-update-status",
    payload,
    "VOLUNTEER_SHIFTS_UPDATED"
  );
};

const updateVolunteerShift = (context, payload) => {
  api.patchUrl(
    context,
    "/volunteershifts/" + payload.id,
    payload,
    "VOLUNTEER_SHIFT_UPDATED"
  );
};

const deleteVolunteerShift = (context, id) => {
  api.deleteUrl(context, "/volunteershifts/" + id, "VOLUNTEER_SHIFT_RESET");
};

const resetVolunteerShift = (context) => {
  context.commit("VOLUNTEER_SHIFT_RESET");
};

export default {
  getVolunteerShifts,
  getVolunteerShiftsByVolunteer,
  searchVolunteerShifts,
  getVolunteerShift,
  createVolunteerShift,
  updateShiftsStatus,
  updateShiftsPendingStatus,
  updateVolunteerShift,
  deleteVolunteerShift,
  resetVolunteerShift,
  getPending,
  searchPending,
};
