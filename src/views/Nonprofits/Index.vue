<template>
  <v-container fluid v-if="nonprofits">
    <v-row>
      <v-col cols="12" lg="9">
        <v-data-iterator
          items-per-page="50"
          :items="nonprofits.data"
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
              <strong class="pl-2">{{ nonprofits.total }} Nonprofits</strong>

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
                  to="/nonprofits/new"
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
                      ><router-link :to="{ name: 'NonprofitNew' }"
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
                  :to="{ name: 'NonprofitShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong>{{ item.name }}</strong>
                </router-link>
                <div class="mt-2">
                  <v-menu
                    :open-on-hover="false"
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
                        v-if="item.city && item.state.abbreviation"
                      >
                        <v-avatar left>
                          <v-icon>mdi-home</v-icon>
                        </v-avatar>
                        {{ item.city }}, {{ item.state.abbreviation }}
                      </v-chip>
                    </template>
                    <div class="tooltip">
                      <span>
                        <p class="my-2">
                          {{ item.address_line_1 }} {{ item.address_line_2
                          }}<br />
                          {{ item.city }}, {{ item.state.abbreviation }}
                          {{ item.postal_code }}<br /><br />
                          <a :href="item.website" target="_blank">{{
                            item.website
                          }}</a>
                        </p>
                      </span>
                    </div>
                  </v-menu>
                </div>
              </v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="nonprofits.last_page"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card color="blue-grey lighten-5" flat>
          <v-card-title>Filter Nonprofits</v-card-title>
          <v-card-text>
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
                <v-text-field
                  v-model="query.cityFilter"
                  label="City"
                ></v-text-field>
                <v-text-field
                  v-model="query.postalCodeFilter"
                  label="Postal Code"
                ></v-text-field>
                <v-autocomplete
                  v-model="query.tagsFilter"
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
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NonprofitsIndex",

  data: () => ({
    search: "",
    page: 1,
    genders: ["male", "female"],
    sizes: ["small", "medium", "large", "x-large", "xx-large"],
    query: {
      stateFilter: null,
      cityFilter: null,
      postalCodeFilter: null,
      tagsFilter: null,
      ids: [],
      allSelected: false,
    },
  }),

  computed: {
    ...mapGetters({
      nonprofits: "nonprofits/nonprofits",
      states: "states/states",
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
      this.$store.dispatch("nonprofits/getNonprofits");
      this.$store.dispatch(
        "tags/searchTags",
        "filter[taggable_type]=Nonprofit"
      );
    },
  },

  methods: {
    checkAll() {
      this.query.ids = [];

      if (this.query.allSelected) {
        for (let n in this.nonprofits.data) {
          this.query.ids.push(this.nonprofits.data[n].id);
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
          process.env.VUE_APP_API_URL + "/nonprofits-export?filter[id]=" + ids;
        this.$store.dispatch("global/resetObjects");
      } else {
        this.$store.dispatch("global/updateAlert", {
          visible: true,
          message: ["Please select item(s) to export"],
          type: "error",
        });
      }
    },

    clear() {
      this.query.stateFilter = null;
      this.query.cityFilter = null;
      this.query.postalCodeFilter = null;
      this.query.tagsFilter = null;
      this.page = 1;
      this.submit(true);
    },

    clearClick() {
      this.search = "";
      this.searchFuzzy();
    },

    searchFuzzy() {
      this.query.stateFilter = null;
      this.query.cityFilter = null;
      this.query.postalCodeFilter = null;
      this.query.tagsFilter = null;
      this.page = 1;

      this.$store.dispatch("nonprofits/searchFuzzy", "q=" + this.search);
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
        this.$store.dispatch("nonprofits/searchFuzzy", "q=" + this.search + "&page=" + pageFilter);
      else
        this.$store.dispatch("nonprofits/searchNonprofits", filter);
    },

    getFilter() {
      let stateFilter =
        this.query.stateFilter != null
          ? "filter[state_id]=" + this.query.stateFilter
          : "filter[state_id]=";

      let cityFilter =
        this.query.cityFilter != null
          ? "&filter[city]=" + this.query.cityFilter
          : "&filter[city]=";

      let postalCodeFilter =
        this.query.postalCodeFilter != null
          ? "&filter[postal_code]=" + this.query.postalCodeFilter
          : "&filter[postal_code]=";

      let tagsFilter =
        this.query.tagsFilter != null
          ? "&filter[tags.id]=" + this.query.tagsFilter
          : "&filter[tags.id]=";

      return stateFilter + cityFilter + postalCodeFilter + tagsFilter;
    },
  },
  mounted() {
    this.$store.dispatch("nonprofits/getNonprofits");
    this.$store.dispatch("states/getStateList");
    this.$store.dispatch("tags/searchTags", "filter[tagable_type]=Nonprofit");
  },
};
</script>
