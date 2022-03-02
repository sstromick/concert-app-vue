import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  emails: [],
  email: null
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
