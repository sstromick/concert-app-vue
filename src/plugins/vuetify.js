import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi", // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: "#0F7133",
        secondary: "#b0bec5",
        accent: "#8c9eff",
        error: "#b71c1c",
        info: "#2196F3",
        success: "#4CAF50",
      },
    },
  },
});
