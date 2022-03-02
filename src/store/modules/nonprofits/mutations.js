const NONPROFITS_UPDATED = (state, nonprofits) => {
  state.nonprofits = nonprofits.data;
};

const NONPROFIT_UPDATED = (state, nonprofit) => {
  state.nonprofit = nonprofit.data;
};

const NONPROFIT_RESET = (state, nonprofit) => {
  state.nonprofit = null;
  state.nonprofits.data = state.nonprofits.data.filter(function(item) {
    return item.id != nonprofit.id;
  });
};

export default {
  NONPROFITS_UPDATED,
  NONPROFIT_UPDATED,
  NONPROFIT_RESET,
};
