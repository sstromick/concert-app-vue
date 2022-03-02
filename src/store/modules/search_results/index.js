import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const state = {
  search_results: [],
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
