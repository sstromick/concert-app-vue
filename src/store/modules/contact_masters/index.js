import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const state = {
  contact_masters: [],
  contact_master: null,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
