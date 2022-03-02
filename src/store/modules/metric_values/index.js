import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const state = {
  metric_values: [],
  metric_value: null,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
