<template>
  <v-container fluid v-if="venues && artists">
    <v-row>
      <v-col cols="12" lg="9">
        <v-data-iterator
          items-per-page="50"
          :items="venues.data"
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
              <strong class="pl-2">{{ venues.total }} Venues</strong>

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
                  to="/venues/new"
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
                      ><router-link :to="{ name: 'VenueNew' }"
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
                  :to="{ name: 'VenueShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong>{{ item.name }}</strong>
                </router-link>
                <div class="mt-2 d-flex flex-wrap">
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ item.address_1 }} {{ item.address_2 }} {{ item.city }},
                    {{ item.state_text }} {{ item.postal_code }}
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
                    {{ formatPhoneNumber(item.phone) }}
                  </v-chip>
                </div>
              </v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="venues.last_page"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card color="blue-grey lighten-5" flat>
          <v-card-title>Filter Venues</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="query.cityFilter"
                  label="City"
                ></v-text-field>
                <v-text-field
                  v-model="query.postalCodeFilter"
                  label="Postal Code"
                ></v-text-field>
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
  name: "VenuesIndex",

  data: () => ({
    search: "",
    page: 1,
    query: {
      cityFilter: null,
      postalCodeFilter: null,
      artistFilter: null,
      ids: [],
      allSelected: false,
    },
  }),

  computed: {
    ...mapGetters({
      venues: "venues/venues",
      artists: "artists/artists",
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
      this.$store.dispatch("venues/getVenues");
      this.$store.dispatch("artists/getArtistList");
    },
  },

  methods: {
    checkAll() {
      this.query.ids = [];

      if (this.query.allSelected) {
        for (let c in this.venues.data) {
          this.query.ids.push(this.venues.data[c].id);
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
          process.env.VUE_APP_API_URL + "/venues-export?filter[id]=" + ids;
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
      this.query.cityFilter = null;
      this.query.postalCodeFilter = null;
      this.query.artistFilter = null;
      this.page = 1;
      this.submit(true);
    },

    clearClick() {
      this.search = "";
      this.searchFuzzy();
    },

    searchFuzzy() {
      this.query.cityFilter = null;
      this.query.postalCodeFilter = null;
      this.query.artistFilter = null;
      this.page = 1;
      this.$store.dispatch("venues/searchFuzzy", "q=" + this.search);
    },

    submit(reset_pagination) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      let pageFilter = this.page != null ? "page=" + this.page : "";

      if (reset_pagination) {
        pageFilter = "";
        this.page = 1;
        this.search = null;
      }

      let filter = this.getFilter() + pageFilter;

      if (this.search)
        this.$store.dispatch("venues/searchFuzzy", "q=" + this.search + "&page=" + pageFilter);
      else
        this.$store.dispatch("venues/searchVenues", filter);
    },

    getFilter() {
      let cityFilter =
        this.query.cityFilter != null
          ? "&filter[city]=" + this.query.cityFilter
          : "&filter[city]=";
      let postalCodeFilter =
        this.query.postalCodeFilter != null
          ? "&filter[postal_code]=" + this.query.postalCodeFilter
          : "&filter[postal_code]=";
      let artistFilter =
        this.query.artistFilter != null
          ? "&filter[performer]=" + this.query.artistFilter
          : "";

      return cityFilter + postalCodeFilter + artistFilter;
    },
  },
  mounted() {
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("venues/getVenues");
  },
};
</script>
