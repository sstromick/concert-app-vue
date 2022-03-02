const STATS_UPDATED = (state, stats) => {
  state.stats = stats.data;
};

export default {
  STATS_UPDATED,
};
