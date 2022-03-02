import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  email_templates: [],
  email_template: null
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
