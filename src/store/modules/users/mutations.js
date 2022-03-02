const USERS_UPDATED = (state, users) => {
  state.users = users.data;
};

const USER_UPDATED = (state, user) => {
  state.user = user.data
}

const USER_RESET = (state) => {
  state.user = null
}

export default {
  USERS_UPDATED,
  USER_UPDATED,
  USER_RESET
};
