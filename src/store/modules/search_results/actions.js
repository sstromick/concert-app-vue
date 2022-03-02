import api from "@/api";

const getSearchResults = (context, filter) => {
  api.getUrl(context, "/search?" + filter, "SEARCH_RESULTS_UPDATED");
};

export default {
  getSearchResults,
};
