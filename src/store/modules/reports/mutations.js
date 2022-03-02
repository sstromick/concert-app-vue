const REPORTS_UPDATED = (state, reports) => {
  state.reports = reports;
};

const REPORT_UPDATED = (state, report) => {
  state.report = report.data;
};

const REPORT_RESET = (state) => {
  state.report = null;
};

export default {
  REPORTS_UPDATED,
  REPORT_UPDATED,
  REPORT_RESET,
};
