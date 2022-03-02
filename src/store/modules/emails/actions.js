import api from "@/api";

const getEmails = (context) => {
  api.getUrl(context, "/emails", "EMAILS_UPDATED");
};

const getEmailList = (context) => {
  api.getUrl(context, "/emails", "EMAILS_UPDATED");
};

const searchEmails = (context, filter) => {
  api.getUrl(context, "/emails?" + filter, "EMAILS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/emails-search?" + filter, "EMAILS_UPDATED");
};

const getEmail = (context, id) => {
  api.getUrl(context, "/emails/" + id, "EMAIL_UPDATED");
};

const createEmail = (context, payload) => {
  api.postUrl(context, "/emails", payload, "EMAIL_UPDATED", {
    name: "EmailShow",
    params: "id",
  });
};

const sendEmails = (context, payload) => {
  api.postUrl(context, "/emails-ondemand", payload, "EMAIL_UPDATED");
};

const updateEmail = (context, payload) => {
  api.patchUrl(context, "/emails/" + payload.id, payload, "EMAIL_UPDATED");
};

const deleteEmail = (context, id) => {
  api.deleteUrl(context, "/emails/" + id, "EMAIL_RESET");
};

const resetEmail = (context) => {
  context.commit("EMAIL_RESET");
};

export default {
  getEmails,
  getEmailList,
  searchEmails,
  searchFuzzy,
  sendEmails,
  getEmail,
  createEmail,
  updateEmail,
  deleteEmail,
  resetEmail,
};
