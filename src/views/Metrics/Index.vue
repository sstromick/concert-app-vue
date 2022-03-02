<template>
  <v-container fluid v-if="metrics">
    <v-row>
      <v-col cols="12">
        <v-data-iterator
          items-per-page="50"
          :items="metrics.data"
          :page="page"
          :search="search"
          no-results-text=""
          no-data-text=""
          hide-default-footer
        >
          <template v-slot:header>
            <v-toolbar flat class="mb-1 align-center">
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
              <v-btn depressed class="btn-primary" to="/metrics/new">
                New Metric
              </v-btn>
            </v-toolbar>
            <v-toolbar flat class="grey lighten-4 mt-8 mb-3"
              >{{ metrics.total }} Results</v-toolbar
            >
          </template>

          <template v-slot:default="props">
            <v-toolbar
              flat
              class="search-result"
              v-for="item in props.items"
              :key="item.id"
            >
              <v-toolbar-title class="flex-grow-1">
                <router-link
                  :to="{ name: 'MetricShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong>{{ item.name }}</strong>
                </router-link>
                <div class="mt-2 d-flex align-center">
                  <v-chip class="mr-2 mb-2" color="blue-grey" text-color="white">
                    {{ item.metric_type }}
                  </v-chip>
                  <v-switch
                    hide-details
                    readonly
                    v-model="item.active"
                    label="Active"
                  ></v-switch>
                </div>
              </v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="metrics.last_page"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MetricsIndex",

  data: () => ({
    snippet: "",
    dialog: false,
    search: "",
    page: 1,
  }),

  computed: {
    ...mapGetters({
      metrics: "metrics/metrics",
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
      this.$store.dispatch("metrics/getMetrics");
    },
  },

  methods: {
    submit(reset_pagination) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      let pageFilter = this.page != null ? "page=" + this.page : "";

      if (reset_pagination) {
        pageFilter = "";
        this.page = 1;
      }

      let filter = pageFilter;

      this.$store.dispatch("metrics/searchMetrics", filter);
    },
  },

  mounted() {
    this.$store.dispatch("metrics/getMetrics");
  },
};
</script>

<style scoped></style>
