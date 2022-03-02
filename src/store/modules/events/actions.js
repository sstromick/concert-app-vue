import api from "@/api";

const getEvents = (context) => {
  api.getUrl(context, "/events", "EVENTS_UPDATED");
};

const getEventList = (context) => {
  api.getUrl(context, "/events-list", "EVENTS_UPDATED");
};

const searchEvents = (context, filter) => {
  api.getUrl(context, "/events?" + filter, "EVENTS_UPDATED");
};

const searchFuzzy = (context, filter) => {
  api.getUrl(context, "/events-search?" + filter, "EVENTS_UPDATED");
};

const exportEvents = (context) => {
  api.getUrl(context, "/events-export", "EVENTS_UPDATED");
};

const getEvent = (context, id) => {
  api.getUrl(context, "/events/" + id, "EVENT_UPDATED");
};

const createEvent = (context, payload) => {
  api.postUrl(context, "/events", payload, "EVENT_UPDATED", {
    name: "EventShifts",
    params: "id",
  });
};

const updateEvent = (context, payload) => {
  api.patchUrl(context, "/events/" + payload.id, payload, "EVENT_UPDATED");
};

const deleteEvent = (context, id) => {
  api.deleteUrl(context, "/events/" + id, "EVENT_RESET");
};

const resetEvent = (context) => {
  context.commit("EVENT_RESET");
};

const searchEventsNoPaginate = (context, filter) => {
  api.getUrl(context, "/events-no-paginate?" + filter, "EVENTS_UPDATED");
};

const uploadPhoto = (context, payload) => {
  api.postUrl(context, "/events-upload-photo/" + payload.getAll('id'), payload, "EVENT_UPDATED");
};

export default {
  getEvents,
  getEventList,
  searchEvents,
  searchFuzzy,
  exportEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  resetEvent,
  searchEventsNoPaginate,
  uploadPhoto
};
