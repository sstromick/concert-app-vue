const authenticated = (state) => {
  if (state.token && state.user) {
    return true;
  } else {
    return false;
  }
};
const user = (state) => state.user;

export default {
  authenticated,
  user,
};
