const STATES_UPDATED = (state, sstates) => {
  state.sstates = sstates.data;
};

const STATE_UPDATED = (state, sstate) => {
  state.sstate = sstate.data
}

const STATE_RESET = (state) => {
  state.sstate = null
}

export default {
  STATES_UPDATED,
  STATE_UPDATED,
  STATE_RESET
};
