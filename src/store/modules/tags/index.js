import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const state = {
  tags: [],
  tag: null,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
