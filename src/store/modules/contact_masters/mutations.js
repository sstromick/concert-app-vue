const CONTACTMASTERS_UPDATED = (state, contact_masters) => {
  state.contact_masters = contact_masters.data;
};

const CONTACTMASTER_UPDATED = (state, contact_master) => {
  state.contact_master = contact_master.data;
};

const CONTACTMASTER_RESET = (state) => {
  state.contact_master = null;
};

export default {
  CONTACTMASTERS_UPDATED,
  CONTACTMASTER_UPDATED,
  CONTACTMASTER_RESET,
};
