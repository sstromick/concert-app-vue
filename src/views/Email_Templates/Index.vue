<template>
  <v-container fluid v-if="emailTemplates">
    <v-row>
      <v-col cols="8">
        <v-data-iterator
          items-per-page="50"
          :items="emailTemplates.data"
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
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-toolbar flat class="grey lighten-4 mt-8 mb-3"
              >{{ emailTemplates.total }} Results</v-toolbar
            >
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
                  :to="{ name: 'EmailTemplateShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong>{{ item.subject }}</strong>
                </router-link>
              </v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="emailTemplates.last_page"
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

export default {
  name: "EmailTemplatesIndex",

  data: () => ({
    search: "",
    page: 1,
    query: {
      eventFilter: null,
      ids: [],
      allSelected: false,
    },
  }),

  computed: {
    ...mapGetters({
      emailTemplates: "email_templates/email_templates",
      events: "events/events",
      shifts: "shifts/shifts",
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
      this.$store.dispatch("email_templates/getEmailTemplates");
    },
  },

  methods: {
    eventArtistTitle(item) {
      return item.name + " - " + item.artist.name;
    },

    checkAll() {
      this.query.ids = [];

      if (this.query.allSelected) {
        for (let e in this.emailTemplates) {
          this.query.ids.push(this.emailTemplates[e].id);
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
          "/emailtemplates-export?filter[id]=" +
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

    clear() {
      this.query.stateFilter = null;
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

      this.$store.dispatch("email_templates/searchEmailTemplates", filter);
    },

    getFilter() {
      let eventFilter =
        this.query.eventFilter != null
          ? "filter[event_id]=" + this.query.eventFilter
          : "filter[event_id]=";

      return eventFilter;
    },
  },
  mounted() {
    this.$store.dispatch("email_templates/getEmailTemplates");
    this.$store.dispatch("events/getEventList");
    this.$store.dispatch("shifts/getShifts");
  },
};
</script>
