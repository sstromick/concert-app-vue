import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "./plugins/moment";
import store from "./store";
import "./plugins/axios";
Vue.config.productionTip = false;

store.dispatch("auth/attempt", localStorage.getItem("token")).then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});

router.beforeResolve((to, from, next) => {
  if (to.name != "Login") {
    store.dispatch("auth/attempt", localStorage.getItem("token"));
  } else {
    if (store.getters["auth/authenticated"]) {
      router.push({ name: "Home" });
    }
  }

  store.dispatch("global/updateLoading", true, { root: true });
  store.dispatch("global/updateAlert", {
    visible: false,
    message: null,
    type: null,
  });
  next();
});
