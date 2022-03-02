<template>
  <v-container fluid>
    <v-row v-if="events">
      <v-col cols="12" lg="9">
        <v-data-iterator
          items-per-page="50"
          :items="events.data"
          :page="page"
          no-results-text=""
          no-data-text=""
          hide-default-footer
        >
          <template v-slot:header>
            <v-toolbar flat class="mb-8 align-center">
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
              <strong class="pl-2">{{ events.total }} Events</strong>

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
                  depressed
                  color="primary"
                  class="btn-primary"
                  to="/events/new"
                >
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
                      ><router-link :to="{ name: 'EventNew' }"
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
              class="search-result"
              v-for="item in props.items"
              :key="item.id"
            >
              <v-checkbox
                class="checkbox"
                v-model="query.ids"
                @change="updateCheckAll"
                :value="item.id"
              ></v-checkbox>
              <v-toolbar-title>
                <router-link
                  :to="{ name: 'EventShifts', params: { id: item.id } }"
                  class="flex flex-grow-1"
                >
                  <strong>{{ eventTitle(item) }}</strong>
                </router-link>
                <div class="mt-2">
                  <v-menu
                    :open-on-hover="true"
                    offset-y
                    class="tooltip-menu"
                    max-width="99%"
                  >
                    <template v-slot:activator="{ on }">
                      <v-chip
                        class="mr-2 mb-2"
                        color="blue-grey"
                        text-color="white"
                        v-on="on"
                        v-if="item.contacts.length"
                      >
                        <v-avatar left>
                          <v-icon>mdi-account-circle</v-icon>
                        </v-avatar>
                        Contacts
                      </v-chip>
                      <v-chip
                        class="mr-2 mb-2"
                        color="blue-grey"
                        text-color="white"
                        v-if="item.start_date && item.end_date"
                      >
                        <v-avatar left>
                          <v-icon>mdi-calendar</v-icon>
                        </v-avatar>
                        {{ item.start_date | moment("MMM D, YYYY") }} -
                        {{ item.end_date | moment("MMM D, YYYY") }}
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
                    <div class="tooltip" v-if="item.contacts">
                      <span v-for="(c, index) in item.contacts" :key="index">
                        <p class="subtitle my-2">
                          {{ c.contact_master.name }}<br />
                          <v-btn
                            text
                            class="px-0 py-1 primary--text btn-tooltip"
                            @click.stop="showDialog(c.contact_master.email)"
                          >
                            {{ c.contact_master.email }}
                          </v-btn>
                          {{ formatPhoneNumber(c.contact_master.phone) }}
                        </p>
                      </span>
                    </div>
                  </v-menu>
                </div>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <div class="my-auto mx-4">
                <v-icon v-if="item.teams">mdi-account-multiple</v-icon>
                <v-icon v-else>mdi-account</v-icon>
              </div>
              <div class="my-auto m-x-4">
                <v-chip
                  color="green mb-2"
                  text-color="white"
                  v-if="checkActive(item)"
                  >Active</v-chip
                >
                <v-chip text-color="green" v-if="!checkActive(item)"
                  >Inactive</v-chip
                >
              </div>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="events.last_page"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card color="blue-grey lighten-5" flat>
          <v-card-title>Filter Events</v-card-title>
          <v-card-text>
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
            <v-row dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="query.contactFilter"
                  :items="contactMasters"
                  item-text="name"
                  item-value="id"
                  label="Contact"
                  chips
                  multiple
                ></v-autocomplete>
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
                <v-checkbox
                  v-model="query.activeFilter"
                  label="Active Only"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  v-model="query.inactiveFilter"
                  label="Inactive Only"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  v-model="query.passiveFilter"
                  label="Passive Only"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  v-model="query.teamFilter"
                  label="Team Only"
                  hide-details
                ></v-checkbox>
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
import BasicEmailDialog from "@/components/EmailDialog/BasicEmailDialog";

export default {
  name: "EventsIndex",
  components: { BasicEmailDialog },

  data: () => ({
    search: "",
    tooltip: false,
    basicEmailDialog: false,
    page: 1,
    menuStartDate: false,
    menuEndDate: false,
    emailTo: null,
    query: {
      startDate: null,
      endDate: null,
      contactFilter: null,
      artistFilter: null,
      venueFilter: null,
      activeFilter: null,
      inactiveFilter: null,
      passiveFilter: null,
      teamFilter: null,
      ids: [],
      allSelected: false,
    },
  }),

  computed: {
    ...mapGetters({
      events: "events/events",
      contactMasters: "contact_masters/contact_masters",
      contacts: "contacts/contacts",
      artists: "artists/artists",
      venues: "venues/venues",
    }),
  },

  methods: {
    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else
        return venue.name;
    },

    showDialog(email) {
      this.emailTo = email;
      this.basicEmailDialog = true;
    },

    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }

      return null;
    },

    checkAll() {
      this.query.ids = [];

      if (this.query.allSelected) {
        for (let e in this.events.data) {
          this.query.ids.push(this.events.data[e].id);
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
          process.env.VUE_APP_API_URL + "/events-export?filter[id]=" + ids;
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

    clear() {
      this.query.startDate = null;
      this.query.endDate = null;
      this.query.contactFilter = null;
      this.query.artistFilter = null;
      this.query.venueFilter = null;
      this.query.inactiveFilter = null;
      this.query.activeFilter = null;
      this.query.passiveFilter = null;
      this.query.teamFilter = null;
      this.page = 1;

      this.submit(true);
    },

    clearClick() {
      this.search = "";
      this.searchFuzzy();
    },

    searchFuzzy() {
      this.query.startDate = null;
      this.query.endDate = null;
      this.query.contactFilter = null;
      this.query.artistFilter = null;
      this.query.venueFilter = null;
      this.query.inactiveFilter = null;
      this.query.activeFilter = null;
      this.query.passiveFilter = null;
      this.query.teamFilter = null;
      this.page = 1;

      this.$store.dispatch("events/searchFuzzy", "q=" + this.search);
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
        this.$store.dispatch("events/searchFuzzy", "q=" + this.search + "&page=" + pageFilter);
      else
        this.$store.dispatch("events/searchEvents", filter);
    },

    getFilter() {
      let sortFilter = "&sort=-start_date";
      let contactFilter =
        this.query.contactFilter != null
          ? "filter[contact]=" + this.query.contactFilter
          : "filter[contact]=";
      let artistFilter =
        this.query.artistFilter != null
          ? "&filter[artist_id]=" + this.query.artistFilter
          : "";
      let venueFilter =
        this.query.venueFilter != null
          ? "&filter[venue_id]=" + this.query.venueFilter
          : "";

      let activeFilter = "";
      let inactiveFilter = "";
      if (this.query.activeFilter && this.query.inactiveFilter) {
        activeFilter = "";
        inactiveFilter = "";
      } else {
        activeFilter =
          this.query.activeFilter == true
            ? "&filter[active]=" + this.query.activeFilter
            : "";
        inactiveFilter =
          this.query.inactiveFilter == true
            ? "&filter[inactive]=" + this.query.inactiveFilter
            : "";
      }

      let passiveFilter =
        this.query.passiveFilter == true
          ? "&filter[passive]=" + !this.query.passiveFilter
          : "";
      let teamFilter =
        this.query.teamFilter == true
          ? "&filter[teams]=" + this.query.teamFilter
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

      return (
        contactFilter +
        artistFilter +
        venueFilter +
        activeFilter +
        inactiveFilter +
        passiveFilter +
        teamFilter +
        dateFilter +
        sortFilter
      );
    },
    eventTitle(item) {
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
  },

  watch: {
    page(val, oldVal) {
      if (val != oldVal) {
        this.page = val;
        this.submit(false);
      }
    },

    $route() {
      this.$store.dispatch("events/searchEvents", "sort=-start_date");
    },
  },
  mounted() {
    this.$store.dispatch("events/searchEvents", "sort=-start_date");
    this.$store.dispatch("contact_masters/getContactMasterList");
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("venues/getVenueList");

    if (this.$route.params.filter == "active") {
      this.query.activeFilter = true;
      this.submit(true);
    }
  },
};
</script>

<style></style>
