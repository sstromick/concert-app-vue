const EMAILTEMPLATES_UPDATED = (state, email_templates) => {
  state.email_templates = email_templates.data;
};

const EMAILTEMPLATE_UPDATED = (state, email_template) => {
  state.email_template = email_template.data
}

const EMAILTEMPLATE_RESET = (state) => {
  state.email_template = null
}

export default {
  EMAILTEMPLATES_UPDATED,
  EMAILTEMPLATE_UPDATED,
  EMAILTEMPLATE_RESET
};
