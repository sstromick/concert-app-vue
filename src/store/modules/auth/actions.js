import axios from "axios";
import router from "@/router";

const login = async (context, payload) => {
  let response = await axios.post("/users/login", payload);
  if (response.data.code === 401) {
    console.log(response);
  } else return context.dispatch("attempt", response.data.data.token);
};

const attempt = async (context, token) => {
  context.commit("TOKEN_UPDATED", token);
  try {
    let response = await axios.post("/users/me", { token: token });
    context.commit("USER_UPDATED", response.data.data.user);
    localStorage.setItem("token", token);
  } catch {
    context.commit("TOKEN_UPDATED", null);
    context.commit("USER_UPDATED", null);
    localStorage.removeItem("token");
    router.push({ name: "Login" });
    context.commit(
      "global/ALERT_UPDATED",
      { visible: true, message: ["Invalid Login"], type: "error" },
      { root: true }
    );
  }
};

const logout = (context) => {
  return axios
    .post("/users/logout", { token: localStorage.getItem("token") })
    .then(() => {
      context.commit("TOKEN_UPDATED", null);
      context.commit("USER_UPDATED", null);
    });
};

export default {
  login,
  attempt,
  logout,
};
