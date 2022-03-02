const METRICS_UPDATED = (state, metrics) => {
  state.metrics = metrics.data;
};

const METRIC_UPDATED = (state, metric) => {
  state.metric = metric.data;
};

const METRIC_RESET = (state) => {
  state.metric = null;
};

export default {
  METRICS_UPDATED,
  METRIC_UPDATED,
  METRIC_RESET,
};
