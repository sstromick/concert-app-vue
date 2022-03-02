import api from "@/api";

const getStates = (context) => {
  api.getUrl(context, "/states", "STATES_UPDATED");
};

const getStateList = (context) => {
  api.getUrl(context, "/states-list", "STATES_UPDATED");
};

const getState = (context, id) => {
  api.getUrl(context, "/states/" + id, "STATE_UPDATED");
};

const createState = (context, payload) => {
  api.postUrl(context, "/states", payload, "STATE_UPDATED", {
    name: "StateShow",
    params: "id",
  });
};

const updateState = (context, payload) => {
  api.patchUrl(context, "/states/" + payload.id, payload, "STATE_UPDATED");
};

const deleteState = (context, id) => {
  api.deleteUrl(context, "/states/" + id, "STATE_RESET");
};

const resetState = (context) => {
  context.commit("STATE_RESET");
};

export default {
  getStates,
  getStateList,
  getState,
  createState,
  updateState,
  deleteState,
  resetState,
};
