const SEARCH_RESULTS_UPDATED = (state, search_results) => {
  state.search_results = search_results.data;
};

export default {
  SEARCH_RESULTS_UPDATED,
};
