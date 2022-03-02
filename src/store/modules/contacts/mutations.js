const CONTACTS_UPDATED = (state, contacts) => {
  state.contacts = contacts.data;
};

const CONTACT_UPDATED = (state, contact) => {
  state.contact = contact.data;

  if (state.contacts.data) {
    state.contacts.data = state.contacts.data.filter(function(item) {
      return item.id != contact.data.id;
    });
    state.contacts.data.push(contact.data);
  }
};

const CONTACT_RESET = (state, contact) => {
  state.contact = null;
  state.contacts.data = state.contacts.data.filter(function(item) {
    return item.id != contact.id;
  });
};

export default {
  CONTACTS_UPDATED,
  CONTACT_UPDATED,
  CONTACT_RESET,
};
