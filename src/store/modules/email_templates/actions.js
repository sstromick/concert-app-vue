import api from "@/api";

const getEmailTemplates = (context) => {
  api.getUrl(context, "/emailtemplates", "EMAILTEMPLATES_UPDATED");
};

const getEmailTemplateList = (context) => {
  api.getUrl(context, "/emailtemplates-list", "EMAILTEMPLATES_UPDATED");
};

const searchEmailTemplates = (context, filter) => {
  api.getUrl(context, "/emailtemplates?" + filter, "EMAILTEMPLATES_UPDATED");
};

const getEmailTemplate = (context, id) => {
  api.getUrl(context, "/emailtemplates/" + id, "EMAILTEMPLATE_UPDATED");
};

const createEmailTemplateEvent = (context, payload) => {
  api.postUrl(context, "/emailtemplates", payload, "EMAILTEMPLATE_UPDATED", {
    name: "EventShifts",
    params: "event_id",
  });
};

const createEmailTemplate = (context, payload) => {
  api.postUrl(context, "/emailtemplates", payload, "EMAILTEMPLATE_UPDATED", {
    name: "EventShifts",
    params: "event_id",
  });
};

const updateEmailTemplate = (context, payload) => {
  api.patchUrl(
    context,
    "/emailtemplates/" + payload.id,
    payload,
    "EMAILTEMPLATE_UPDATED"
  );
};

const deleteEmailTemplate = (context, id) => {
  api.deleteUrl(context, "/emailtemplates/" + id, "EMAILTEMPLATE_RESET");
};

const resetEmailTemplate = (context) => {
  context.commit("EMAILTEMPLATE_RESET");
};

const getEventEmailTemplates = (context, filter) => {
  api.getUrl(
    context,
    "/emailtemplates-event" + filter,
    "EMAILTEMPLATES_UPDATED"
  );
};

export default {
  getEmailTemplates,
  getEmailTemplateList,
  searchEmailTemplates,
  getEmailTemplate,
  createEmailTemplateEvent,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  resetEmailTemplate,
  getEventEmailTemplates,
};
