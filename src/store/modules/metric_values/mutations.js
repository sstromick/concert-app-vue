const METRICVALUES_UPDATED = (state, metric_values) => {
  state.metric_values = metric_values.data;
};

const METRICVALUE_UPDATED = (state, metric_value) => {
  state.metric_value = metric_value.data;
};

const METRICVALUE_RESET = (state) => {
  state.metric_value = null;
};

export default {
  METRICVALUES_UPDATED,
  METRICVALUE_UPDATED,
  METRICVALUE_RESET,
};
