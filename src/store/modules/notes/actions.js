import api from "@/api";

const getNotes = (context) => {
  api.getUrl(context, "/notes", "NOTES_UPDATED");
};

const getNote = (context, id) => {
  api.getUrl(context, "/notes/" + id, "NOTE_UPDATED");
};

const searchNotes = (context, filter) => {
  api.getUrl(context, "/notes?" + filter, "NOTES_UPDATED");
};

const createNote = (context, payload) => {
  api.postUrl(context, "/notes", payload, "NOTES_UPDATED");
};

const updateNote = (context, payload) => {
  api.patchUrl(context, "/notes/" + payload.id, payload, "NOTE_UPDATED");
};

const deleteNote = (context, id) => {
  api.deleteUrl(context, "/notes/" + id, "NOTE_RESET");
};

const resetNote = (context) => {
  context.commit("NOTE_RESET");
};

export default {
  getNotes,
  searchNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  resetNote,
};
