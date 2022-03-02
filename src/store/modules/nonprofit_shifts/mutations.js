const NONPROFIT_SHIFTS_UPDATED = (state, nonprofit_shifts) => {
  state.nonprofit_shifts = nonprofit_shifts.data;
};

const NONPROFIT_SHIFT_UPDATED = (state, nonprofit_shift) => {
  state.nonprofit_shift = nonprofit_shift.data
}

const NONPROFIT_SHIFT_RESET = (state) => {
  state.nonprofit_shift = null
}

export default {
  NONPROFIT_SHIFTS_UPDATED,
  NONPROFIT_SHIFT_UPDATED,
  NONPROFIT_SHIFT_RESET
};
