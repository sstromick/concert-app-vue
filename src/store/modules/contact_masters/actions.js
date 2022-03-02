import api from "@/api";

const getContactMasters = (context) => {
  api.getUrl(context, "/contactmasters", "CONTACTMASTERS_UPDATED");
};

const getContactMasterList = (context) => {
  api.getUrl(context, "/contactmasters-list", "CONTACTMASTERS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(
    context,
    "/contactmasters-search?" + filter,
    "CONTACTMASTERS_UPDATED"
  );
};

const searchContactMasters = (context, filter) => {
  api.getUrl(context, "/contactmasters?" + filter, "CONTACTMASTERS_UPDATED");
};

const getContactMaster = (context, id) => {
  api.getUrl(context, "/contactmasters/" + id, "CONTACTMASTER_UPDATED");
};

const updateContactMaster = (context, payload) => {
  api.patchUrl(
    context,
    "/contactmasters/" + payload.id,
    payload,
    "CONTACTMASTER_UPDATED"
  );
};

const deleteContactMaster = (context, id) => {
  api.deleteUrl(context, "/contactmasters/" + id, "CONTACTMASTER_RESET");
};

const resetContactMaster = (context) => {
  context.commit("CONTACTMASTER_RESET");
};

export default {
  getContactMasters,
  getContactMasterList,
  searchContactMasters,
  getContactMaster,
  updateContactMaster,
  deleteContactMaster,
  resetContactMaster,
  searchFuzzy,
};
