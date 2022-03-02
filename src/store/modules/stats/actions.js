import api from "@/api";

const stats = (context) => {
  api.getUrl(context, "/dashboard-totals", "STATS_UPDATED");
};

export default {
  stats,
};
