import api from "@/api";

const getShifts = (context) => {
  api.getUrl(context, "/shifts", "SHIFTS_UPDATED");
};

const getShiftList = (context) => {
  api.getUrl(context, "/shifts-list", "SHIFTS_UPDATED");
};

const getShift = (context, id) => {
  api.getUrl(context, "/shifts/" + id, "SHIFT_UPDATED");
};

const createShift = (context, payload) => {
  api.postUrl(context, "/shifts", payload, "SHIFT_UPDATED", {
    name: "EventShifts",
  });
};

const updateShift = (context, payload) => {
  api.patchUrl(context, "/shifts/" + payload.id, payload, "SHIFT_UPDATED");
};

const deleteShift = (context, id) => {
  api.deleteUrl(context, "/shifts/" + id, "SHIFT_RESET");
};

const resetShift = (context) => {
  context.commit("SHIFT_RESET");
};

const searchShifts = (context, filter) => {
  api.getUrl(context, "/shifts?" + filter, "SHIFTS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/shifts-search?" + filter, "SHIFTS_UPDATED");
};

const searchShiftsAll = (context, filter) => {
  api.getUrl(context, "/shifts-all?" + filter, "SHIFTS_UPDATED");
};

export default {
  getShifts,
  getShiftList,
  getShift,
  createShift,
  updateShift,
  deleteShift,
  resetShift,
  searchShifts,
  searchFuzzy,
  searchShiftsAll,
};
