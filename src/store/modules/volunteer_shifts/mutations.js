const VOLUNTEER_SHIFTS_UPDATED = (state, volunteer_shifts) => {
  state.volunteer_shifts = volunteer_shifts.data;
};

const VOLUNTEER_SHIFT_UPDATED = (state, volunteer_shift) => {
  state.volunteer_shift = volunteer_shift.data;
};

const VOLUNTEER_SHIFT_RESET = (state) => {
  state.volunteer_shift = null;
};

export default {
  VOLUNTEER_SHIFTS_UPDATED,
  VOLUNTEER_SHIFT_UPDATED,
  VOLUNTEER_SHIFT_RESET,
};
