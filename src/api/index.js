import router from "../router";

export default {
  getUrl(context, url, type) {
    axios
      .get(url)
      .then((response) => {
        context.commit(type, response.data);
        context.commit("global/LOADING_COMPLETED", true, { root: true });
      })
      .catch((error) => {
        context.commit(
          "global/ALERT_UPDATED",
          { visible: true, message: error.response.data.error, type: "error" },
          { root: true }
        );
      });
  },

  postUrl(context, url, payload, type, redirect, alert, event) {
    axios
      .post(url, payload)
      .then((response) => {
        context.commit(type, response.data);
        if (redirect) {
          if (redirect.params == "id") {
            redirect.params = { id: response.data.data.id };
          }
          if (redirect.params == "shift_id") {
            redirect.params = { id: response.data.data.shift_id };
          }
          if (redirect.params == "event_shift_id") {
            redirect.params = {
              id: response.data.data.event_id,
              shift_id: response.data.data.shift_id,
            };
          }
          if (redirect.params == "event_id") {
            redirect.params = {
              id: response.data.data.event_id,
            };
          }
          router.push({ name: redirect.name, params: redirect.params });
        }

        context.commit("global/LOADING_COMPLETED", true, { root: true });

        if (alert != false) {
          context.commit(
            "global/ALERT_UPDATED",
            { visible: true, message: response.data.message, type: "success" },
            { root: true }
          );
        }
        if (event) axios.post("/events", event);
      })
      .catch((error) => {
        context.commit(
          "global/ALERT_UPDATED",
          { visible: true, message: error.response.data.error, type: "error" },
          { root: true }
        );
      });
  },

  patchUrl(context, url, payload, type, alert, event) {
    axios
      .patch(url, payload)
      .then((response) => {
        context.commit(type, response.data);
        if (alert != false) {
          context.commit(
            "global/ALERT_UPDATED",
            { visible: true, message: response.data.message, type: "success" },
            { root: true }
          );
        }
        context.commit("global/LOADING_COMPLETED", true, { root: true });
        if (event) axios.post("/events", event);
      })
      .catch((error) => {
        context.commit(
          "global/ALERT_UPDATED",
          { visible: true, message: error.response.data.error, type: "error" },
          { root: true }
        );
      });
  },

  deleteUrl(context, url, type, event) {
    axios
      .delete(url)
      .then((response) => {
        context.commit(type, response.data.data);
        context.commit(
          "global/ALERT_UPDATED",
          { visible: true, message: response.data.message, type: "success" },
          { root: true }
        );
        context.commit("global/LOADING_COMPLETED", true, { root: true });
        if (event) axios.post("/events", event);
      })
      .catch((error) => {
        console.log("delete error");
        console.log(error);
        console.log(error.response);
        context.commit(
          "global/ALERT_UPDATED",
          { visible: true, message: error.response.data.error, type: "error" },
          { root: true }
        );
      });
  },
};
