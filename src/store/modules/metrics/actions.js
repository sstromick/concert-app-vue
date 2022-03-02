import api from "@/api";

const getMetrics = (context) => {
  api.getUrl(context, "/metrics", "METRICS_UPDATED");
};

const searchMetrics = (context, filter) => {
  api.getUrl(context, "/metrics?" + filter, "METRICS_UPDATED");
};

const getMetric = (context, id) => {
  api.getUrl(context, "/metrics/" + id, "METRIC_UPDATED");
};

const searchMetricsNoPaginate = async (context, filter) => {
  await api.getUrl(
    context,
    "/metrics-no-paginate?" + filter,
    "METRICS_UPDATED"
  );
};

const createMetric = (context, payload) => {
  api.postUrl(context, "/metrics", payload, "METRIC_UPDATED", {
    name: "MetricsIndex",
  });
};

const updateMetric = (context, payload) => {
  api.patchUrl(context, "/metrics/" + payload.id, payload, "METRIC_UPDATED");
};

const deleteMetric = (context, id) => {
  api.deleteUrl(context, "/metrics/" + id, "METRIC_RESET");
};

const resetMetric = (context) => {
  context.commit("METRIC_RESET");
};

export default {
  getMetrics,
  searchMetrics,
  searchMetricsNoPaginate,
  getMetric,
  createMetric,
  updateMetric,
  deleteMetric,
  resetMetric,
};
