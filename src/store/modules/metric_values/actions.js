import api from "@/api";

const getMetricValues = (context) => {
  api.getUrl(context, "/metric-values", "METRICVALUES_UPDATED");
};

const searchMetricValuesNoPaginate = async (context, filter) => {
  await api.getUrl(
    context,
    "/metric-values-no-paginate?" + filter,
    "METRICVALUES_UPDATED"
  );
};

const updateMetricValues = (context, payload) => {
  api.postUrl(
    context,
    "/metric-values-update-metrics/",
    payload,
    "METRICVALUE_UPDATED"
  );
};

export default {
  getMetricValues,
  searchMetricValuesNoPaginate,
  updateMetricValues,
};
