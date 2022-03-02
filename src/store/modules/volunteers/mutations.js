const VOLUNTEERS_UPDATED = (state, volunteers) => {
  state.volunteers = volunteers.data;
};

const VOLUNTEER_UPDATED = (state, volunteer) => {
  state.volunteer = volunteer.data;
};

const VOLUNTEER_RESET = (state, volunteer) => {
  state.volunteer = null;
  state.volunteers.data = state.volunteers.data.filter(function(item) {
    return item.id != volunteer.id;
  });
};

export default {
  VOLUNTEERS_UPDATED,
  VOLUNTEER_UPDATED,
  VOLUNTEER_RESET,
};
