import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  nonprofit_shifts: [],
  nonprofit_shift: null
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
