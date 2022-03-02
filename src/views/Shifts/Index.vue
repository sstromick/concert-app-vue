<template>
  <v-container fluid>
    <v-row v-if="shifts">
      <v-col cols="8">
        <v-data-iterator
          items-per-page="50"
          :items="shifts.data"
          :page="page"
          :search="search"
          no-results-text=""
          no-data-text=""
          hide-default-footer
        >
          <template v-slot:header>
            <v-toolbar flat class="mb-1 align-center">
              <v-checkbox
                class="select-all-checkbox"
                v-model="query.allSelected"
                @change="checkAll"
              ></v-checkbox>
              <v-text-field
                v-model="search"
                clearable
                light
                outlined
                solo
                flat
                hide-details
                append-inner-icon="mdi-magnify"
                label="Search"
              ></v-text-field>

              <v-spacer></v-spacer>
              <v-toolbar-items class="hidden-sm-and-down">
                <v-btn
                  depressed
                  class="mr-3 btn-secondary"
                  @click="exportCSV()"
                >
                  Export
                </v-btn>

                <v-btn depressed class="btn-primary" to="/shifts/new">
                  Create New
                </v-btn>
              </v-toolbar-items>
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" class="hidden-md-and-up">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title
                      ><a @click="exportCSV()" href="#"
                        >Export</a
                      ></v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title
                      ><router-link :to="{ name: 'ShiftNew' }"
                        >Create New</router-link
                      ></v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-toolbar flat class="grey lighten-4 mb-3"
              >{{ shifts.total }} Results</v-toolbar
            >
          </template>

          <template v-slot:default="props">
            <v-toolbar
              flat
              class="search-result"
              v-for="item in props.items"
              :key="item.name"
            >
              <v-checkbox
                class="checkbox"
                v-model="query.ids"
                @change="updateCheckAll"
                :value="item.id"
              ></v-checkbox>
              <v-toolbar-title class="flex-grow-1">
                <router-link
                  :to="{
                    name: 'ShiftShow',
                    params: { id: item.event_id, shift_id: item.id },
                  }"
                  class="flex flex-grow-1"
                >
                  <strong v-if="item.name">{{ item.name }}</strong>
                  <strong v-else>
                    {{ item.start_date | moment("dddd MMM D, YYYY") }}</strong
                  >
                  <strong
                    v-if="item.venue && item.venue.state && item.venue.city"
                  >
                    - {{ item.venue.city }},
                    {{ item.venue.state.abbreviation }}
                  </strong>
                  <div class="subtitle pt-4" v-if="item.artist">
                    <strong>Artist:</strong> {{ item.artist.name }}<br /><strong
                      >Venue:</strong
                    >
                    {{ item.venue ? item.venue.name : "" }}<br /><strong
                      >Doors:</strong
                    >
                    {{ item.doors }} <strong>Check-In:</strong>
                    {{ item.check_in }}
                  </div>
                </router-link>
                <div v-if="item.event.teams" class="mt-2 d-flex flex-wrap">
                  <v-menu
                    :open-on-hover="true"
                    :offset-y="true"
                    class="tooltip-menu"
                    max-width="99%"
                  >
                    <template v-slot:activator="{ on }">
                      <v-chip
                        class="mr-2 mb-2"
                        color="blue-grey"
                        text-color="white"
                        v-on="on"
                      >
                        <v-avatar left>
                          <v-icon>mdi-alarm</v-icon>
                        </v-avatar>
                        <strong class="pr-1">Schedule</strong>
                      </v-chip>
                    </template>
                    <div class="tooltip">
                      <span v-if="item.event.teams">
                        <ul class="schedule-items-list">
                          <li
                            v-for="scheduleItem in item.shift_schedules"
                            :key="scheduleItem.id"
                          >
                            <strong>{{
                              scheduleItem.start_date
                                | moment("dddd MMM D, YYYY")
                            }}</strong
                            ><br />Doors: {{ scheduleItem.doors }} | Check:
                            {{ scheduleItem.check_in }}
                          </li>
                        </ul>
                      </span>
                    </div>
                  </v-menu>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.venue"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ formatVenueName(item.venue) }}
                  </v-chip>
                </div>
                <div v-else class="mt-2 d-flex flex-wrap">
                  <template>
                    <v-chip
                      class="mr-2 mb-2"
                      color="blue-grey"
                      text-color="white"
                    >
                      <v-avatar left>
                        <v-icon>mdi-alarm</v-icon>
                      </v-avatar>
                      <strong class="pr-1">Doors:</strong>
                      {{ item.doors }}
                    </v-chip>
                    <v-chip
                      class="mr-2 mb-2"
                      color="blue-grey"
                      text-color="white"
                    >
                      <v-avatar left>
                        <v-icon>mdi-alarm</v-icon>
                      </v-avatar>
                      <strong class="pr-1">Check-In:</strong>
                      {{ item.check_in }}
                    </v-chip>
                    <v-chip
                      class="mr-2 mb-2"
                      color="blue-grey"
                      text-color="white"
                      v-if="item.venue"
                    >
                      <v-avatar left>
                        <v-icon>mdi-home</v-icon>
                      </v-avatar>
                      {{ formatVenueName(item.venue) }}
                    </v-chip>
                  </template>
                </div>
              </v-toolbar-title>
              <div class="my-auto mx-4">
                <div class="subheading font-weight-bold">
                  {{ item.start_date | moment("MM/DD/YYYY") }}
                </div>
                <div class="text-center">Start</div>
              </div>
              <div class="my-auto mx-4">
                <div class="subheading font-weight-bold">
                  {{ item.end_date | moment("MM/DD/YYYY") }}
                </div>
                <div class="text-center">End</div>
              </div>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="shifts.last_page"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
      <v-col cols="4">
        <v-form class="form-filter">
          <v-container>
            <v-row>
              <v-col cols="12" class="py-0"><h4>FILTER</h4></v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
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
                      v-model="query.startDate"
                      label="Start Date"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="query.startDate"
                    @input="menuStartDate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
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
                      v-model="query.endDate"
                      label="End Date"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="query.endDate"
                    @input="menuEndDate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-autocomplete
                  v-model="query.eventFilter"
                  :items="events"
                  item-text="name"
                  item-value="id"
                  label="Event"
                  chips
                  multiple
                >
                  <template v-slot:item="{ item }">
                    {{ eventArtistTitle(item) }}
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col cols="12">
                <v-autocomplete
                  v-model="query.artistFilter"
                  :items="artists"
                  item-text="name"
                  item-value="id"
                  label="Artist"
                  chips
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col cols="12">
                <v-autocomplete
                  v-model="query.venueFilter"
                  :items="venues"
                  item-text="name"
                  item-value="id"
                  label="Venue"
                  chips
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-btn dark color="#2196F3" class="mr-3" @click="submit(true)">
                  Search
                </v-btn>
                <v-btn color="#FCFCFC" class="" @click="clear()">
                  Clear
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "ShiftsIndex",

  data: () => ({
    search: "",
    page: 1,
    emailTo: "",
    valid: false,
    menuStartDate: false,
    menuEndDate: false,
    query: {
      startDate: null,
      endDate: null,
      eventFilter: null,
      artistFilter: null,
      venueFilter: null,
      ids: [],
      allSelected: false,
    },
  }),

  computed: {
    ...mapGetters({
      shifts: "shifts/shifts",
      events: "events/events",
      artists: "artists/artists",
      venues: "venues/venues",
    }),
  },
  watch: {
    page(val, oldVal) {
      if (val != oldVal) {
        this.page = val;
        this.submit(false);
      }
    },

    $route() {
      this.$store.dispatch("shifts/getShifts");
    },
  },

  methods: {
    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else return venue.name;
    },

    eventArtistTitle(item) {
      return item.name + " - " + item.artist.name;
    },

    checkAll() {
      this.query.ids = [];

      if (this.query.allSelected) {
        for (let s in this.shifts.data) {
          this.query.ids.push(this.shifts.data[s].id);
        }
      }
    },

    updateCheckAll() {
      this.query.allSelected = false;
    },

    exportCSV() {
      let ids = this.query.ids.join();
      if (ids) {
        window.location.href =
          process.env.VUE_APP_API_URL + "/shifts-export?filter[id]=" + ids;
        this.$store.dispatch("global/resetObjects");
      } else {
        this.$store.dispatch("global/updateAlert", {
          visible: true,
          message: ["Please select item(s) to export"],
          type: "error",
        });
      }
    },

    convertTime(input) {
      return moment(input, "HH:mm:ss").format("h:mm A");
    },

    clear() {
      this.query.startDate = null;
      this.query.endDate = null;
      this.query.eventFilter = null;
      this.query.artistFilter = null;
      this.query.venueFilter = null;
      this.page = 1;
      this.submit(true);
    },

    submit(reset_pagination) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      let pageFilter = this.page != null ? "&page=" + this.page : "";

      if (reset_pagination) {
        pageFilter = "";
        this.page = 1;
      }

      let filter = this.getFilter() + pageFilter;

      this.$store.dispatch("shifts/searchShifts", filter);
    },

    getFilter() {
      let eventFilter =
        this.query.eventFilter != null
          ? "filter[event_id]=" + this.query.eventFilter
          : "filter[event_id]=";
      let artistFilter =
        this.query.artistFilter != null
          ? "&filter[artist_id]=" + this.query.artistFilter
          : "";
      let venueFilter =
        this.query.venueFilter != null
          ? "&filter[venue_id]=" + this.query.venueFilter
          : "";

      let dateFilter = "";
      if (this.query.startDate && this.query.endDate)
        dateFilter =
          "&filter[start_between]=" +
          this.query.startDate +
          "," +
          this.query.endDate;
      else if (this.query.startDate || this.query.endDate) {
        if (this.query.startDate)
          dateFilter = "&filter[starts_after]=" + this.query.startDate;
        else dateFilter = "&filter[ends_before]=" + this.query.endDate;
      }

      return eventFilter + artistFilter + venueFilter + dateFilter;
    },
  },
  mounted() {
    this.$store.dispatch("shifts/getShifts");
    this.$store.dispatch("events/getEventList");
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("venues/getVenueList");

    if (this.$route.params.filter == "upcoming") {
      this.query.startDate = moment().format("YYYY-MM-DD");
      this.submit(true);
    }
  },
};
</script>
