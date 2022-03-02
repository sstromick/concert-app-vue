import api from "@/api";

const getContacts = (context) => {
  api.getUrl(context, "/contacts", "CONTACTS_UPDATED");
};

const getContactList = (context) => {
  api.getUrl(context, "/contacts-list", "CONTACTS_UPDATED");
};

const searchContacts = (context, filter) => {
  api.getUrl(context, "/contacts?" + filter, "CONTACTS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/contacts-search?" + filter, "CONTACTS_UPDATED");
};

const getContact = (context, id) => {
  api.getUrl(context, "/contacts/" + id, "CONTACT_UPDATED");
};

const createContact = (context, payload, redirect) => {
  api.postUrl(context, "/contacts", payload, "CONTACT_UPDATED", redirect);
};

const updateContact = (context, payload) => {
  api.patchUrl(context, "/contacts/" + payload.id, payload, "CONTACT_UPDATED");
};

const deleteContact = (context, id) => {
  api.deleteUrl(context, "/contacts/" + id, "CONTACT_RESET");
};

const resetContact = (context) => {
  context.commit("CONTACT_RESET");
};

export default {
  getContacts,
  getContactList,
  searchContacts,
  searchFuzzy,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  resetContact,
};
