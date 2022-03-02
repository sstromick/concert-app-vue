import api from "@/api";

const getUsers = (context) => {
  api.getUrl(context, "/users", "USERS_UPDATED");
};

const searchUsers = (context, filter) => {
  api.getUrl(context, "/users?" + filter, "USERS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/users-search?" + filter, "USERS_UPDATED");
};

const getUser = (context, id) => {
  api.getUrl(context, "/users/" + id, "USER_UPDATED");
};

const createUser = (context, payload) => {
  api.postUrl(context, "/users", payload, "USER_UPDATED", {
    name: "UsersIndex",
  });
};

const resetCredentials = (context, payload) => {
  payload.token = localStorage.getItem("token");
  api.postUrl(
    context,
    "/users/reset-credentials",
    payload,
    "USER_UPDATED",
    null,
    false
  );
  var user = context.rootGetters["users/user"];
  context.commit(
    "auth/USER_UPDATED",
    { id: user.id, name: user.name, email: user.email },
    { root: true }
  );
  context.commit(
    "global/ALERT_UPDATED",
    { visible: true, message: ["User Updated"], type: "success" },
    { root: true }
  );
};

const updateUser = (context, payload) => {
  api.patchUrl(context, "/users/" + payload.id, payload, "USER_UPDATED");
};

const deleteUser = (context, id) => {
  api.deleteUrl(context, "/users/" + id, "USER_RESET");
};

const resetUser = (context) => {
  context.commit("USER_RESET");
};

export default {
  getUsers,
  searchUsers,
  searchFuzzy,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetUser,
  resetCredentials,
};
