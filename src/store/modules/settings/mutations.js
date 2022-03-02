const SETTINGS_UPDATED = (state, settings) => {
  state.settings = settings.data;
};

const SETTING_UPDATED = (state, setting) => {
  state.setting = setting.data;
};

const SETTING_RESET = (state) => {
  state.setting = null;
};

export default {
  SETTINGS_UPDATED,
  SETTING_UPDATED,
  SETTING_RESET,
};
