const NOTES_UPDATED = (state, notes) => {
  state.notes = notes.data;
};

const NOTE_UPDATED = (state, note) => {
  state.note = note.data;
};

const NOTE_RESET = (state) => {
  state.note = null;
};

export default {
  NOTES_UPDATED,
  NOTE_UPDATED,
  NOTE_RESET,
};
