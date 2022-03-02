<template>
  <v-container fluid v-if="users">
    <v-row>
      <v-col cols="12" lg="9">
        <v-data-iterator
          items-per-page="50"
          :items="users.data"
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
              <strong class="pl-2">{{ users.total }} Users</strong>

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
                  to="/users/new"
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
                      ><router-link :to="{ name: 'UserNew' }"
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
                  :to="{ name: 'UserShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong class="capitalize"
                    >{{ item.first_name }} {{ item.last_name }}</strong
                  >
                </router-link>
                <div class="mt-2">
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.email"
                  >
                    <v-avatar left>
                      <v-icon>mdi-account-circle</v-icon>
                    </v-avatar>
                    {{ item.email }}
                  </v-chip>
                </div>
              </v-toolbar-title>
              <div class="my-auto m-x-4">
                <v-switch disabled :input-value="item.active"></v-switch>
              </div>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="users.last_page"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card color="blue-grey lighten-5" flat>
          <v-card-title>Filter Users</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-model="query.activeFilter"
                  label="Active Only"
                ></v-checkbox>
                <v-checkbox
                  v-model="query.inactiveFilter"
                  label="Inactive Only"
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
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "UsersIndex",

  data: () => ({
    search: "",
    page: 1,
    query: {
      activeFilter: null,
      inactiveFilter: null,
      selected: [],
      ids: [],
      allSelected: false,
    },
  }),

  computed: {
    ...mapGetters({
      users: "users/users",
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
      this.$store.dispatch("users/getUsers");
    },
  },

  methods: {
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
          process.env.VUE_APP_API_URL + "/users-export?filter[id]=" + ids;
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
      this.query.activeFilter = null;
      this.query.inactiveFilter = null;
      this.page = 1;
      this.submit(true);
    },

    clearClick() {
      this.search = "";
      this.searchFuzzy();
    },

    searchFuzzy() {
      this.query.activeFilter = null;
      this.query.inactiveFilter = null;
      this.page = 1;

      this.$store.dispatch("users/searchFuzzy", "q=" + this.search);
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
        this.$store.dispatch("users/searchFuzzy", "q=" + this.search + "&page=" + pageFilter);
      else
        this.$store.dispatch("users/searchUsers", filter);
    },

    getFilter() {
      let activeFilter = null;
      let inactiveFilter = null;
      if (this.query.activeFilter && this.query.inactiveFilter) {
        activeFilter = "";
        inactiveFilter = "";
      } else {
        activeFilter =
          this.query.activeFilter == true ? "filter[active]=1" : "";
        inactiveFilter =
          this.query.inactiveFilter == true ? "&filter[active]=0" : "";
      }

      return activeFilter + inactiveFilter;
    },
  },
  mounted() {
    this.$store.dispatch("users/getUsers");
    this.$store.dispatch("states/getStates");
  },
};
</script>
