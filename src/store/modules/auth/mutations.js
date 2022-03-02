const TOKEN_UPDATED = (state, token) => {
  state.token = token;
};

const USER_UPDATED = (state, user) => {
  state.user = user;
};

export default {
  TOKEN_UPDATED,
  USER_UPDATED,
};
