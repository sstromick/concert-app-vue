import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  countries: [],
  country: null
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
