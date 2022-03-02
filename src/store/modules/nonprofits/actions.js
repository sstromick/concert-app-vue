import api from "@/api";

const getNonprofits = (context) => {
  api.getUrl(context, "/nonprofits", "NONPROFITS_UPDATED");
};

const getNonprofitList = (context) => {
  api.getUrl(context, "/nonprofits-list", "NONPROFITS_UPDATED");
};

const getNonprofitsNoPaginate = (context) => {
  api.getUrl(context, "/nonprofits-no-paginate", "NONPROFITS_UPDATED");
};

const searchNonprofits = (context, filter) => {
  api.getUrl(context, "/nonprofits?" + filter, "NONPROFITS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/nonprofits-search?" + filter, "NONPROFITS_UPDATED");
};

const getNonprofit = (context, id) => {
  api.getUrl(context, "/nonprofits/" + id, "NONPROFIT_UPDATED");
};

const createNonprofit = (context, payload) => {
  api.postUrl(context, "/nonprofits", payload, "NONPROFIT_UPDATED", {
    name: "NonprofitsIndex",
  });
};

const updateNonprofit = (context, payload) => {
  api.patchUrl(
    context,
    "/nonprofits/" + payload.id,
    payload,
    "NONPROFIT_UPDATED"
  );
};

const mergeNonprofit = (context, payload) => {
  api.postUrl(
    context,
    "/nonprofits-merge/" + payload.id,
    payload,
    "NONPROFIT_UPDATED",
    {
      name: "NonprofitsIndex",
    }
  );
};

const deleteNonprofit = (context, id) => {
  api.deleteUrl(context, "/nonprofits/" + id, "NONPROFIT_RESET");
};

const resetNonprofit = (context) => {
  context.commit("NONPROFIT_RESET");
};

const uploadPhoto = (context, payload) => {
  api.postUrl(
    context,
    "/nonprofits-upload-photo/" + payload.getAll("id"),
    payload,
    "NONPROFIT_UPDATED"
  );
};

export default {
  getNonprofits,
  getNonprofitsNoPaginate,
  getNonprofitList,
  searchNonprofits,
  searchFuzzy,
  getNonprofit,
  createNonprofit,
  updateNonprofit,
  deleteNonprofit,
  resetNonprofit,
  uploadPhoto,
  mergeNonprofit,
};
