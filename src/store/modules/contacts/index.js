import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  contacts: [],
  contact: null
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
