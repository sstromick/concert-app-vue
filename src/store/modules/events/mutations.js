const EVENTS_UPDATED = (state, events) => {
  state.events = events.data;
};

const EVENT_UPDATED = (state, event) => {
  state.event = event.data;
};

const EVENT_RESET = (state, event) => {
  state.event = null;
  state.events.data = state.events.data.filter(function(item) {
    return item.id != event.id;
  });
};

export default {
  EVENTS_UPDATED,
  EVENT_UPDATED,
  EVENT_RESET,
};
