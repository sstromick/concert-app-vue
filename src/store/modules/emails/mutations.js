const EMAILS_UPDATED = (state, emails) => {
  state.emails = emails.data;
};

const EMAIL_UPDATED = (state, email) => {
  state.email = email.data
}

const EMAIL_RESET = (state) => {
  state.email = null
}

export default {
  EMAILS_UPDATED,
  EMAIL_UPDATED,
  EMAIL_RESET
};
