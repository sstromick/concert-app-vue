import api from "@/api";

const generateReport = (context, payload) => {
  api.postUrl(context, "/reports", payload, "REPORT_UPDATED");
};

export default {
  generateReport,
};
