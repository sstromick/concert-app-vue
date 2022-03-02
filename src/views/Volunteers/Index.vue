<template>
  <v-container fluid v-if="volunteers">
    <v-row>
      <v-col cols="12" lg="9">
        <v-data-iterator
          items-per-page="50"
          :items="volunteers.data"
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
              <strong class="pl-2">{{ volunteers.total }} Volunteers</strong>

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
                  to="/volunteers/new"
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
                      ><router-link :to="{ name: 'VolunteerNew' }"
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
                  :to="{ name: 'VolunteerShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong class="captalize"
                    >{{ item.first_name }} {{ item.last_name }}</strong
                  >
                </router-link>
                <div
                  v-if="
                    item.created_at ||
                      item.city ||
                      item.tshirt_size ||
                      item.gender
                  "
                  class="mt-2 d-flex flex-wrap"
                >
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.created_at"
                  >
                    <v-avatar left>
                      <v-icon>mdi-calendar</v-icon>
                    </v-avatar>
                    {{ item.created_at | moment("MMM D, YYYY") }}
                  </v-chip>
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
                        v-if="item.city && item.state"
                      >
                        <v-avatar left>
                          <v-icon>mdi-home</v-icon>
                        </v-avatar>
                        {{ item.city }}, {{ item.state.abbreviation }}
                      </v-chip>
                    </template>
                    <div class="tooltip">
                      <span>
                        <p class="subtitle my-2" v-if="item.state">
                          {{ item.address_line_1 }} {{ item.address_line_2
                          }}<br />
                          {{ item.city }}, {{ item.state.abbreviation }}
                          {{ item.postal_code }}
                          <v-btn
                            text
                            class="px-0 py-1 primary--text btn-tooltip"
                            @click.stop="showDialog(item.email)"
                          >
                            {{ item.email }}
                          </v-btn>
                          {{ formatPhoneNumber(item.phone) }}
                        </p>
                      </span>
                    </div>
                  </v-menu>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.gender"
                  >
                    <v-avatar left>
                      <v-icon>mdi-account-circle</v-icon>
                    </v-avatar>
                    <strong class="pr-2">Gender: </strong>
                    <span class="capitalize">{{ item.gender }}</span>
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.tshirt_size"
                  >
                    <v-avatar left>
                      <v-icon>mdi-tshirt-crew</v-icon>
                    </v-avatar>
                    <span class="capitalize">{{ item.tshirt_size }}</span>
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.phone"
                  >
                    <v-avatar left>
                      <v-icon>mdi-phone</v-icon>
                    </v-avatar>
                    <span>{{ item.phone }}</span>
                  </v-chip>
                </div>
              </v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="volunteers.last_page"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card color="blue-grey lighten-5" flat>
          <v-card-title>Filter Volunteers</v-card-title>
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
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="query.stateFilter"
                  :items="states"
                  item-text="name"
                  item-value="id"
                  label="State"
                  chips
                  multiple
                  clearable
                ></v-autocomplete>
                <v-autocomplete
                  v-model="query.sizeFilter"
                  :items="sizes"
                  label="T-Shirt Size"
                  chips
                  multiple
                  clearable
                ></v-autocomplete>
                <v-autocomplete
                  v-model="query.eventFilter"
                  :items="events"
                  item-text="name"
                  item-value="id"
                  label="Event"
                  chips
                  multiple
                  clearable
                >
                  <template v-slot:item="{ item }">
                    {{ eventArtistTitle(item) }}
                  </template>
                </v-autocomplete>
                <v-autocomplete
                  v-model="query.artistFilter"
                  :items="artists"
                  item-text="name"
                  item-value="id"
                  label="Artist"
                  chips
                  multiple
                  clearable
                ></v-autocomplete>
                <v-autocomplete
                  v-model="query.tagFilter"
                  :items="tags.data"
                  item-text="content"
                  item-value="id"
                  label="Tag"
                  chips
                  multiple
                  clearable
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
    <BasicEmailDialog
      :active="basicEmailDialog"
      :to="emailTo"
      @close="basicEmailDialog = false"
    ></BasicEmailDialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import BasicEmailDialog from "@/components/EmailDialog/BasicEmailDialog";

export default {
  name: "VolunteersIndex",
  components: { BasicEmailDialog },

  data: () => ({
    search: "",
    page: 1,
    basicEmailDialog: false,
    genders: ["male", "female"],
    sizes: ["small", "medium", "large", "x-large", "xx-large"],
    emailTo: null,
    menuStartDate: false,
    menuEndDate: false,
    query: {
      startDate: null,
      endDate: null,
      stateFilter: null,
      sizeFilter: null,
      eventFilter: null,
      artistFilter: null,
      tagFilter: null,
      ids: [],
      allSelected: false,
    },
  }),

  computed: {
    ...mapGetters({
      volunteers: "volunteers/volunteers",
      states: "states/states",
      events: "events/events",
      artists: "artists/artists",
      tags: "tags/tags",
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
      this.$store.dispatch("volunteers/getVolunteers");
      this.$store.dispatch("events/getEventList");
      this.$store.dispatch("artists/getArtistList");
      this.$store.dispatch("tags/searchTags", "filter[tagable_type]=Volunteer");
    },
  },

  methods: {
    eventArtistTitle(item) {
      return item.name + " - " + item.artist.name;
    },

    showDialog(email) {
      this.emailTo = email;
      this.basicEmailDialog = true;
    },

    checkAll() {
      this.query.ids = [];

      if (this.query.allSelected) {
        for (let v in this.volunteers.data) {
          this.query.ids.push(this.volunteers.data[v].id);
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
          process.env.VUE_APP_API_URL + "/volunteers-export?filter[id]=" + ids;
        this.$store.dispatch("global/resetObjects");
      } else {
        this.$store.dispatch("global/updateAlert", {
          visible: true,
          message: ["Please select item(s) to export"],
          type: "error",
        });
      }
    },

    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }

      return null;
    },

    clear() {
      this.query.startDate = null;
      this.query.endDate = null;
      this.query.stateFilter = null;
      this.query.sizeFilter = null;
      this.query.eventFilter = null;
      this.query.artistFilter = null;
      this.query.tagFilter = null;
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
      this.query.stateFilter = null;
      this.query.sizeFilter = null;
      this.query.eventFilter = null;
      this.query.artistFilter = null;
      this.query.tagFilter = null;
      this.page = 1;

      this.$store.dispatch("volunteers/searchFuzzy", "q=" + this.search);
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
        this.$store.dispatch("volunteers/searchFuzzy", "q=" + this.search + "&page=" + pageFilter);
      else
        this.$store.dispatch("volunteers/searchVolunteers", filter);
    },

    getFilter() {
      let stateFilter =
        this.query.stateFilter != null
          ? "filter[state_id]=" + this.query.stateFilter
          : "filter[state_id]=";
      let sizeFilter =
        this.query.sizeFilter != null
          ? "&filter[tshirt_size]=" + this.query.sizeFilter
          : "";
      let eventFilter =
        this.query.eventFilter != null
          ? "&filter[VolunteerShifts.shift.event_id]=" + this.query.eventFilter
          : "";
      let artistFilter =
        this.query.artistFilter != null
          ? "&filter[VolunteerShifts.shift.artist_id]=" +
            this.query.artistFilter
          : "";
      let tagFilter =
        this.query.tagFilter != null
          ? "&filter[tags.id]=" + this.query.tagFilter
          : "";
      let dateFilter = "";
      if (this.query.startDate && this.query.endDate)
        dateFilter =
          "&filter[volunteer_shift_created_between]=" +
          this.query.startDate +
          "," +
          this.query.endDate;
      else if (this.query.startDate || this.query.endDate) {
        if (this.query.startDate)
          dateFilter =
            "&filter[volunteer_shift_created_after]=" + this.query.startDate;
        else
          dateFilter =
            "&filter[volunteer_shift_created_before]=" + this.query.endDate;
      }

      return (
        stateFilter +
        sizeFilter +
        eventFilter +
        artistFilter +
        tagFilter +
        dateFilter
      );
    },
  },
  mounted() {
    this.$store.dispatch("volunteers/getVolunteers");
    this.$store.dispatch("states/getStateList");
    this.$store.dispatch("events/getEventList");
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("tags/searchTags", "filter[tagable_type]=Volunteer");

    if (this.$route.params.filter == "pending") {
      this.query.pendingFilter = true;
      this.submit(true);
    }
  },
};
</script>

<style>
v-list-item-title {
  cursor: grab;
}
</style>
