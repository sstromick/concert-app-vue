import api from "@/api";

const getNonprofitShifts = context => {
  api.getUrl(context, "/nonprofitshifts", "NONPROFIT_SHIFTS_UPDATED");
};

const getNonprofitShift = (context, id) => {
  api.getUrl(context, "/nonprofitshifts/" + id, "NONPROFIT_SHIFT_UPDATED");
};

const searchNonprofitShifts = (context, filter) => {
  api.getUrl(context, "/nonprofitshifts?" + filter, "NONPROFIT_SHIFTS_UPDATED");
};

const createNonprofitShift = (context, payload) => {
  api.postUrl(context, "/nonprofitshifts", payload, "NONPROFIT_SHIFT_UPDATED", {
    name: "NonProfitShiftShow",
    params: "id"
  });
};

const updateNonprofitShifts = (context, payload) => {
  api.postUrl(
    context,
    "/nonprofitshifts-update-shifts",
    payload,
    "NONPROFIT_SHIFT_UPDATED"
  );
};

const updateNonprofitShift = (context, payload) => {
  api.patchUrl(
    context,
    "/nonprofitshifts/" + payload.id,
    payload,
    "NONPROFIT_SHIFT_UPDATED"
  );
};

const deleteNonprofitShift = (context, id) => {
  api.deleteUrl(context, "/nonprofitshifts/" + id, "NONPROFIT_SHIFT_RESET");
};

const resetNonprofitShift = context => {
  context.commit("NONPROFIT_SHIFT_RESET");
};

export default {
  getNonprofitShifts,
  getNonprofitShift,
  searchNonprofitShifts,
  updateNonprofitShifts,
  createNonprofitShift,
  updateNonprofitShift,
  deleteNonprofitShift,
  resetNonprofitShift
};
