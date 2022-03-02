import api from "@/api";

const getSettings = (context) => {
  api.getUrl(context, "/settings", "SETTINGS_UPDATED");
};

const getSettingsNoPaginate = (context) => {
  api.getUrl(context, "/settings-no-paginate", "SETTINGS_UPDATED");
};

const searchSettings = (context, filter) => {
  api.getUrl(context, "/settings?" + filter, "SETTINGS_UPDATED");
};

const getSetting = (context, id) => {
  api.getUrl(context, "/settings/" + id, "SETTING_UPDATED");
};

const createSetting = (context, payload) => {
  api.postUrl(context, "/settings", payload, "SETTING_UPDATED", {
    name: "SettingShow",
    params: "id",
  });
};

const updateSetting = (context, payload) => {
  api.patchUrl(context, "/settings/" + payload.id, payload, "SETTING_UPDATED");
};

const deleteSetting = (context, id) => {
  api.deleteUrl(context, "/settings/" + id, "SETTING_RESET");
};

const resetSetting = (context) => {
  context.commit("SETTING_RESET");
};

export default {
  getSettings,
  getSettingsNoPaginate,
  searchSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  resetSetting,
};
