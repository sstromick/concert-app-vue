<template>
  <v-container fluid v-if="event && shifts">
    <EventHeader :event="event" />
    <v-row class="mt-5">
      <v-col cols="12" lg="9">
        <v-data-iterator
          items-per-page="50"
          :items="shifts.data"
          :page="page"
          no-results-text=""
          no-data-text=""
          hide-default-footer
        >
          <template v-slot:header>
            <v-toolbar flat class="mb-4 align-center">
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
                @keyup.enter="searchFuzzy"
                @click:clear="clearClick"
              ></v-text-field>
              <strong class="pl-2">{{ shifts.total }} Shifts</strong>

              <v-spacer></v-spacer>
              <v-toolbar-items class="hidden-sm-and-down">
                <v-btn
                  depressed
                  class="mr-3 btn-secondary"
                  @click="exportCSV()"
                >
                  Export
                </v-btn>

                <v-btn
                  dark
                  color="primary"
                  class="btn-primary"
                  :to="{ name: 'ShiftNew', params: { id: event.id } }"
                >
                  Create Shift
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
          </template>

          <template v-slot:default="props">
            <v-toolbar
              flat
              class="search-result search-result2"
              v-for="item in props.items"
              :key="item.id"
            >
              <div class="d-flex">
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
                  </router-link>
                  <div v-if="event.teams" class="mt-2 d-flex flex-wrap">
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
              </div>
              <div class="d-flex ml-4">
                <div class="my-auto mx-4">
                  <v-icon @click="showModal(item.id)" color="primary"
                    >mdi-email</v-icon
                  >
                </div>
                <div class="my-auto mx-4">
                  <div class="subheading font-weight-bold text-center">
                    {{ acceptedCount(item.volunteer_shifts) }}
                  </div>
                  <div>Accepted</div>
                </div>
                <div class="my-auto mx-4">
                  <div class="subheading font-weight-bold text-center">
                    {{ waitlistCount(item.volunteer_shifts) }}
                  </div>
                  <div>Waitlist</div>
                </div>
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
      <v-col cols="12" lg="3">
        <v-card color="blue-grey lighten-5" flat>
          <v-card-title>Filter Shifts</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-menu
                  v-model="menuStartDate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  :offset-y="true"
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
                  :offset-y="true"
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
            <v-row dense>
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
            <v-row dense>
              <v-col cols="6">
                <v-autocomplete
                  v-model="query.doorsFilter"
                  :items="times"
                  item-text="time"
                  item-value="id"
                  label="Doors"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  v-model="query.checkinFilter"
                  :items="times"
                  item-text="time"
                  item-value="id"
                  label="Checkin"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn light class="mr-3" color="primary" @click="submit(true)">
              Search
            </v-btn>
            <v-btn text @click="clear()">
              Clear
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <EmailDialog
      :active="emailDialog"
      :shiftId="selectedShiftId"
      :eventId="this.event.id"
      @close="emailDialog = false"
    ></EmailDialog>
    <BasicEmailDialog
      :active="basicEmailDialog"
      :to="emailTo"
      @close="basicEmailDialog = false"
    ></BasicEmailDialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import EmailDialog from "@/components/EmailDialog/EmailDialog";
import BasicEmailDialog from "@/components/EmailDialog/BasicEmailDialog";
import EventHeader from "@/components/Event/EventHeader";

export default {
  name: "EventShifts",
  components: {
    EmailDialog,
    BasicEmailDialog,
    EventHeader,
  },

  data: () => ({
    dialog: false,
    search: "",
    emailTo: "",
    valid: false,
    selectedShiftId: 0,
    active: 0,
    basicEmailDialog: false,
    emailDialog: false,
    page: 1,
    menuStartDate: false,
    menuEndDate: false,
    doorsHour: "",
    doorsMinute: "",
    checkinHour: "",
    checkinMinute: "",
    times: [
      "00:00",
      "00:15",
      "00:30",
      "00:45",
      "01:00",
      "01:15",
      "01:30",
      "01:45",
      "02:00",
      "02:15",
      "02:30",
      "02:45",
      "03:00",
      "03:15",
      "03:30",
      "03:45",
      "04:00",
      "04:15",
      "04:30",
      "04:45",
      "05:00",
      "05:15",
      "05:30",
      "05:45",
      "06:00",
      "06:15",
      "06:30",
      "06:45",
      "07:00",
      "07:15",
      "07:30",
      "07:45",
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:15",
      "12:30",
      "12:45",
      "13:00",
      "13:15",
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:30",
      "15:45",
      "16:00",
      "16:15",
      "16:30",
      "16:45",
      "17:00",
      "17:15",
      "17:30",
      "17:45",
      "18:00",
      "18:15",
      "18:30",
      "18:45",
      "19:00",
      "19:15",
      "19:30",
      "19:45",
      "20:00",
      "20:15",
      "20:30",
      "20:45",
      "21:00",
      "21:15",
      "21:30",
      "21:45",
      "22:00",
      "22:15",
      "22:30",
      "22:45",
      "23:00",
      "23:15",
      "23:30",
      "23:45",
    ],

    query: {
      startDate: null,
      endDate: null,
      artistFilter: null,
      venueFilter: null,
      doorsFilter: null,
      checkinFilter: null,
      ids: [],
      allSelected: false,
    },
  }),
  computed: {
    ...mapGetters({
      event: "events/event",
      shifts: "shifts/shifts",
      venues: "venues/venues",
      artists: "artists/artists",
    }),
  },

  methods: {
    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else
        return venue.name;
    },

    updateEvent() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("events/updateEvent", this.event);
        this.dialog = false;
      }
    },

    showModal(shiftId) {
      this.selectedShiftId = shiftId;
      this.emailDialog = true;
    },

    showDialog(email) {
      this.emailTo = email;
      this.basicEmailDialog = true;
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

    checkActive(item) {
      return moment().isBefore(moment(item.end_date, "YYYY-MM-DD"), "days");
    },

    acceptedCount(shifts) {
      let count = 0;
      for (let i = 0; i < shifts.length; i++) {
        count += shifts[i].accepted;
      }

      return count;
    },

    waitlistCount(shifts) {
      let count = 0;
      for (let i = 0; i < shifts.length; i++) {
        count += shifts[i].waitlist;
      }

      return count;
    },

    convertTime(input) {
      return moment(input, "HH:mm:ss").format("h:mm A");
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },

    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },

    clear() {
      this.query.startDate = null;
      this.query.endDate = null;
      this.query.artistFilter = null;
      this.query.venueFilter = null;
      this.query.doorsFilter = null;
      this.query.checkinFilter = null;
      this.page = 1;

      this.submit(true);
    },

    getFilter() {
      let eventFilter = "filter[event_id]=" + this.event.id;
      let artistFilter =
        this.query.artistFilter != null
          ? "&filter[artist_id]=" + this.query.artistFilter
          : "";
      let venueFilter =
        this.query.venueFilter != null
          ? "&filter[venue_id]=" + this.query.venueFilter
          : "";
      let doorsFilter =
        this.query.doorsFilter != null
          ? "&filter[doors]=" + this.query.doorsFilter + ":00"
          : "";
      let checkinFilter =
        this.query.checkinFilter != null
          ? "&filter[check_in]=" + this.query.checkinFilter + ":00"
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

      let sort = "&sort=start_date";

      return (
        eventFilter +
        artistFilter +
        venueFilter +
        doorsFilter +
        checkinFilter +
        dateFilter +
        sort
      );
    },

    clearClick() {
      this.search = "";
      this.searchFuzzy();
    },

    searchFuzzy() {
      this.query.startDate = null;
      this.query.endDate = null;
      this.query.artistFilter = null;
      this.query.venueFilter = null;
      this.query.doorsFilter = null;
      this.query.checkinFilter = null;
      this.page = 1;

      if (this.search == "")
        this.$store.dispatch(
          "shifts/searchShifts",
          "sort=start_date&filter[event_id]=" + this.$route.params.id
        );
      else
        this.$store.dispatch(
          "shifts/searchFuzzy",
          "event=" + this.$route.params.id + "&q=" + this.search
        );
    },

    submit(reset_pagination) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      let pageFilter = this.page != null ? "&page=" + this.page : "";

      if (reset_pagination) {
        pageFilter = "";
        this.page = 1;
        this.search = null;
      }

      let filter = this.getFilter() + pageFilter;

      if (this.search)
        this.$store.dispatch("shifts/searchFuzzy", "q=" + this.search + "&page=" + pageFilter);
      else
        this.$store.dispatch("shifts/searchShifts", filter);
    },
  },

  watch: {
    page(val, oldVal) {
      if (val != oldVal) {
        this.page = val;
        this.submit(false);
      }
    },

    $route() {
      this.$store.dispatch("events/getEvent", this.$route.params.id);
      this.$store.dispatch("shifts/getShifts", this.$route.params.id);
    },
  },

  mounted() {
    this.$store.dispatch("events/getEvent", this.$route.params.id);
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("venues/getVenueList");
    this.$store.dispatch(
      "shifts/searchShifts",
      "sort=start_date&filter[event_id]=" + this.$route.params.id
    );
  },
};
</script>

<style scoped>
.card-router-link {
  text-decoration: underline !important;
}

.schedule-items-list {
  list-style: none;
  padding-left: 0 !important;
}
.schedule-items-list li {
  margin-bottom: 1rem !important;
}
.schedule-items-list li:last-child {
  margin-bottom: 0 !important;
}

.v-card__subtitle {
  padding-top: 0 !important;
}
.v-toolbar__content {
  padding-bottom: 0 !important;
}
</style>
