const VENUES_UPDATED = (state, venues) => {
  state.venues = venues.data;
};

const VENUE_UPDATED = (state, venue) => {
  state.venue = venue.data;
};

const VENUE_RESET = (state, venue) => {
  state.venue = null;
  state.venues.data = state.venues.data.filter(function(item) {
    return item.id != venue.id;
  });
};

export default {
  VENUES_UPDATED,
  VENUE_UPDATED,
  VENUE_RESET,
};
