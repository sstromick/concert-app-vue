const SHIFTS_UPDATED = (state, shifts) => {
  state.shifts = shifts.data;
};

const SHIFT_UPDATED = (state, shift) => {
  state.shift = shift.data
}

const SHIFT_RESET = (state) => {
  state.shift = null
}

export default {
  SHIFTS_UPDATED,
  SHIFT_UPDATED,
  SHIFT_RESET
};
