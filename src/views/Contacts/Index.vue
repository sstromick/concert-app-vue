<template>
  <v-container fluid v-if="contactMasters">
    <v-row>
      <v-col cols="12" lg="9">
        <v-data-iterator
          items-per-page="50"
          :items="contactMasters.data"
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
              <strong class="pl-2">{{ contactMasters.total }} Contacts</strong>

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
                  to="/contacts/new"
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
                      ><router-link :to="{ name: 'ContactNew' }"
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
              <v-toolbar-title class="flex-grow-1">
                <router-link
                  :to="{ name: 'ContactShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong>{{ item.name }}</strong>
                </router-link>
                <div class="mt-2 d-flex" v-if="item.contacts">
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-for="(c, index) in filteredContacts(item.contacts)"
                    :key="index"
                  >
                    {{ c.contactable_type.replace("App\\Models\\", "") }}
                  </v-chip>
                </div>
              </v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="contactMasters.last_page"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card color="blue-grey lighten-5" flat>
          <v-card-title>Filter Contacts</v-card-title>
          <v-card-text>
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
                <v-autocomplete
                  v-model="query.nonprofitFilter"
                  :items="nonprofits"
                  item-text="name"
                  item-value="id"
                  label="Non-Profit"
                  chips
                  multiple
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
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ContactsIndex",

  data: () => ({
    search: "",
    page: 1,
    query: {
      eventFilter: null,
      artistFilter: null,
      venueFilter: null,
      nonprofitFilter: null,
      ids: [],
      allSelected: false,
    },
  }),

  computed: {
    ...mapGetters({
      contactMasters: "contact_masters/contact_masters",
      artists: "artists/artists",
      events: "events/events",
      venues: "venues/venues",
      nonprofits: "nonprofits/nonprofits",
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
      this.$store.dispatch("contact_masters/getContactMasters");
    },
  },

  methods: {
    eventArtistTitle(item) {
      return item.name + " - " + item.artist.name;
    },

    filteredContacts(contacts) {
      return contacts.filter(
        (v, i, a) =>
          a.findIndex((t) => t.contactable_type === v.contactable_type) === i
      );
      //return contacts;
    },

    checkAll() {
      this.query.ids = [];

      if (this.query.allSelected) {
        for (let c in this.contactMasters.data) {
          this.query.ids.push(this.contactMasters.data[c].id);
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
          process.env.VUE_APP_API_URL +
          "/contactmasters-export?filter[id]=" +
          ids;
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
      this.query.eventFilter = null;
      this.query.artistFilter = null;
      this.query.venueFilter = null;
      this.query.nonprofitFilter = null;
      this.page = 1;
      this.submit(true);
    },

    clearClick() {
      this.search = "";
      this.searchFuzzy();
    },

    searchFuzzy() {
      this.query.eventFilter = null;
      this.query.artistFilter = null;
      this.query.venueFilter = null;
      this.query.nonprofitFilter = null;
      this.page = 1;
      this.$store.dispatch("contact_masters/searchFuzzy", "q=" + this.search);
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
        this.$store.dispatch("contact_masters/searchFuzzy", "q=" + this.search + "&page=" + pageFilter);
      else
        this.$store.dispatch("contact_masters/searchContactMasters", filter);
    },

    getFilter() {
      let eventFilter =
        this.query.eventFilter != null
          ? "filter[event]=" + this.query.eventFilter
          : "";
      let artistFilter =
        this.query.artistFilter != null
          ? "&filter[artist]=" + this.query.artistFilter
          : "";
      let venueFilter =
        this.query.venueFilter != null
          ? "&filter[venue]=" + this.query.venueFilter
          : "";
      let nonprofitFilter =
        this.query.nonprofitFilter != null
          ? "&filter[nonprofit]=" + this.query.nonprofitFilter
          : "";

      return eventFilter + artistFilter + venueFilter + nonprofitFilter;
    },
  },
  mounted() {
    this.$store.dispatch("contact_masters/getContactMasters");
    this.$store.dispatch("events/getEventList");
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("venues/getVenueList");
    this.$store.dispatch("nonprofits/getNonprofitList");
  },
};
</script>
