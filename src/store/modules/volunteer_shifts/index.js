import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  volunteer_shifts: [],
  volunteer_shift: null
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
