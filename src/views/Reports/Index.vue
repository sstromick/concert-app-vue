<template>
  <v-container fluid>
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>Reports</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon @click="filter = !filter"
          ><v-icon>mdi-magnify</v-icon></v-btn
        >
        <v-btn text @click="exportClick">Export</v-btn>
        <v-btn text @click="createReport">Update</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <div
      v-if="filter && metrics"
      class="criteria text--primary d-flex flex-row"
    >
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6" lg="4" class="pr-8">
            <div class="d-flex justify-space-between align-center mb-4">
              <h3>Select statistics</h3>
              <v-btn text class="primary" @click="selectAll">Select All</v-btn>
            </div>
            <v-row dense>
              <v-col
                cols="6"
                v-for="(metric, index) in metricsList"
                :key="index"
              >
                <v-checkbox
                  v-model="metricsList[index].checked"
                  :label="metric.name"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <v-autocomplete
              v-model="event_id"
              :items="events"
              label="Event"
              :item-text="buildEventName"
              item-value="id"
              auto-select-first
              clearable
              chips
              multiple
              dense
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="shift_id"
              :items="shifts"
              :disabled="shiftLookupDisabled"
              label="Shift"
              :item-text="buildShiftName"
              item-value="id"
              auto-select-first
              clearable
              dense
              chips
              multiple
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="artist_id"
              :items="artists"
              :disabled="artistLookupDisabled"
              label="Artist"
              item-text="name"
              item-value="id"
              auto-select-first
              clearable
              dense
              chips
              multiple
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="venue_id"
              :items="venues"
              :disabled="venueLookupDisabled"
              label="Venue"
              item-text="name"
              item-value="id"
              auto-select-first
              clearable
              dense
              chips
              multiple
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" lg="4">
            <v-menu
              v-model="menuStartDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="start_date"
                  label="Start Date"
                  clearable
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="start_date"
                @input="menuStartDate = false"
              ></v-date-picker>
            </v-menu>
            <v-menu
              v-model="menuEndDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="end_date"
                  label="End Date"
                  clearable
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="end_date"
                @input="menuEndDate = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="my-auto mx-2"></div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div v-if="report && showReport" fluid>
      <v-data-iterator
        :items="report"
        no-results-text=""
        no-data-text=""
        hide-default-header
      >
        <template v-slot:header>
          <v-toolbar flat class="grey lighten-4 mb-0">
            <v-toolbar-title class="flex-grow-1"
              ><strong>Label</strong></v-toolbar-title
            >
            <strong>Value</strong>
          </v-toolbar>
        </template>
        <template v-slot:default="props">
          <v-toolbar
            flat
            v-for="item in props.items"
            :key="item.stat"
            class="detail"
          >
            <v-toolbar-title class="flex-grow-1">
              {{ item.stat }}</v-toolbar-title
            >
            {{ formattedAmount(item) }}
          </v-toolbar>
        </template>
      </v-data-iterator>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "ReportsIndex",
  components: {},

  data() {
    return {
      shiftLookupDisabled: true,
      artistLookupDisabled: false,
      venueLookupDisabled: false,
      filter: true,
      showReport: false,
      filterButtonText: "Hide Filters",
      menuStartDate: false,
      menuEndDate: false,

      event_id: null,
      shift_id: null,
      artist_id: null,
      venue_id: null,

      metricsList: [],
      start_date: null,
      end_date: null,
      lastItem: "",
    };
  },

  computed: {
    ...mapGetters({
      events: "events/events",
      shifts: "shifts/shifts",
      artists: "artists/artists",
      venues: "venues/venues",
      report: "reports/report",
      metrics: "metrics/metrics",
    }),
  },

  methods: {
    formattedAmount(item) {
      let amt = item.amount
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

      if (item.stat[0] === "$") return "$" + amt.toLocaleString();
      else return amt.toLocaleString();
    },

    buildEventName(item) {
      const separator = " - ";
      let eventTitle = "";
      let artistName = item.artist ? item.artist.name : null;
      let venueName = item.venue ? item.venue.name : null;
      let eventName = item.name;
      if (artistName) eventTitle += artistName;
      if (venueName)
        eventTitle += eventTitle ? separator + venueName : venueName;
      if (eventName)
        eventTitle += eventTitle ? separator + eventName : eventName;

      return eventTitle;
    },

    buildShiftName(item) {
      if (item.name) return item.name;
      else {
        let name = moment(item.start_date).format("dddd MMM D, YYYY");
        if (item.venue)
          if (item.venue.city)
            name +=
              " " + item.venue.city + ", " + item.venue.state.abbreviation;
        return name;
      }
    },

    selectAll() {
      if (this.metricsList.every((item) => item.checked)) {
        for (let i = 0; i < this.metricsList.length; i++) {
          this.metricsList[i].checked = false;
        }
      } else {
        for (let i = 0; i < this.metricsList.length; i++) {
          this.metricsList[i].checked = true;
        }
      }
    },

    getFilter() {
      let eventFilter = "";
      let artistFilter = "";
      let venueFilter = "";
      if (this.event_id)
        if (this.event_id.length > 0)
          eventFilter = "&filter[event_id]=" + this.event_id;

      if (this.artist_id)
        if (this.artist_id.length > 0)
          artistFilter = "&filter[artist_id]=" + this.artist_id;

      if (this.venue_id)
        if (this.artist_id.length > 0)
          venueFilter = "&filter[venue_id]=" + this.venue_id;

      let filter = eventFilter + artistFilter + venueFilter;
      if (filter.charAt(0) == "&") {
        return filter.slice(1);
      } else return filter;
    },

    hideFiltersClick() {
      this.showCriteria = !this.showCriteria;

      if (this.showCriteria) this.filterButtonText = "Hide Filters";
      else this.filterButtonText = "Show Filters";
    },

    exportClick() {
      let csvContent = "data:text/csv;charset=utf-8,";

      for (let i = 0; i < this.report.length; i++) {
        csvContent +=
          this.report[i].stat.replace("#", "") +
          "," +
          this.report[i].amount +
          "\n";
      }

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "export.csv");
      link.click();
    },

    createReport() {
      this.filter = false;
      let reportData = {};

      let selectedStats = [];
      for (let i = 0; i < this.metricsList.length; i++) {
        if (this.metricsList[i].checked) {
          selectedStats.push({
            id: this.metricsList[i].metric_id,
            label: this.metricsList[i].name,
          });
        }
      }

      if (this.event_id) reportData["event_id"] = this.event_id;
      if (this.shift_id) reportData["shift_id"] = this.shift_id;
      if (this.artist_id) reportData["artist_id"] = this.artist_id;
      if (this.venue_id) reportData["venue_id"] = this.venue_id;
      if (this.start_date) reportData["start_date"] = this.start_date;
      if (this.end_date) reportData["end_date"] = this.end_date;

      reportData["sel_stats"] = selectedStats;

      this.$store.dispatch("reports/generateReport", reportData);

      this.showReport = true;
    },
  },

  watch: {
    metrics() {
      for (let i = 0; i < this.metrics.length; i++) {
        this.metricsList.push({
          name: this.metrics[i].name,
          metric_id: this.metrics[i].id,
          checked: false,
        });
      }
    },

    event_id() {
      if (this.event_id == null) this.event_id;
      this.shiftLookupDisabled = false;
      this.$store.dispatch("shifts/searchShiftsAll", this.getFilter());
    },

    shift_id() {
      if (this.shift_id == null || this.shift_id.length == 0) {
        this.artistLookupDisabled = false;
        this.venueLookupDisabled = false;
      } else {
        this.artistLookupDisabled = true;
        this.venueLookupDisabled = true;
      }
    },

    artist_id() {
      this.$store.dispatch("shifts/searchShiftsAll", this.getFilter());
    },

    venue_id() {
      this.$store.dispatch("shifts/searchShiftsAll", this.getFilter());
    },
  },

  mounted() {
    if (this.$route.params.event_id)
      this.event_id = this.$route.params.event_id;
    if (this.$route.params.shift_id)
      this.shift_id = this.$route.params.shift_id;

    this.$store.dispatch("events/getEventList");
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("venues/getVenueList");
    this.$store.dispatch("metrics/searchMetricsNoPaginate", "filter[active]=1");
  },
};
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.report-stat {
  margin-bottom: 1rem;
}

.detail {
  border-bottom: 1px solid #f5f5f5;
}
</style>
