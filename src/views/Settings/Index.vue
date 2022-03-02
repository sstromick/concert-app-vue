<template>
  <v-container fluid v-if="settings">
    <v-row>
      <v-col cols="12">
        <v-data-iterator
          items-per-page="50"
          :items="settings.data"
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
              <v-toolbar-items class="hidden-sm-and-down">
                <v-btn
                  depressed
                  class="btn-primary mr-4"
                  @click.stop="dialog = true"
                >
                  Show JS Confirmation Snippet
                </v-btn>
                <v-dialog v-model="dialog">
                  <v-card>
                    <v-card-title
                      class="headline text-center mx-auto justify-center"
                      >Copy the code below and paste it onto your website
                      confirmation page.<br />Make sure jQuery is loaded on that
                      page.</v-card-title
                    >
                    <v-card-text>
                      {{ snippet }}
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <v-btn depressed class="btn-primary" to="/settings/new">
                  New Setting
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
                      ><a @click.stop="dialog = true" href="#"
                        >Show JS Confirmation Snippet</a
                      ></v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title
                      ><router-link :to="{ name: 'SettingNew' }"
                        >New Setting</router-link
                      ></v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-toolbar flat class="grey lighten-4 mt-8 mb-3"
              >{{ settings.total }} Results</v-toolbar
            >
          </template>

          <template v-slot:default="props">
            <v-toolbar
              flat
              class="search-result"
              v-for="item in props.items"
              :key="item.name"
            >
              <v-toolbar-title class="flex-grow-1">
                <router-link
                  :to="{ name: 'SettingShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong>{{ item.name }}</strong>
                </router-link>
              </v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="settings.last_page"
                :total-visible="15"
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
  name: "SettingsIndex",

  data: () => ({
    snippet: "",
    dialog: false,
    search: "",
    page: 1,
  }),

  computed: {
    ...mapGetters({
      settings: "settings/settings",
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
      this.$store.dispatch("settings/getSettings");
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

      this.$store.dispatch("settings/searchSettings", filter);
    },
  },

  mounted() {
    this.$store.dispatch("settings/getSettings");
    /* eslint-disable */
    this.snippet = `
<script>
  $(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('id')) {
      id = urlParams.get('id');

      $.ajax({
        url     : '${process.env.VUE_APP_API_URL}/volunteershifts/' + id,
        async: true,
        dataType: 'json',
        type: 'PUT',
        data: {
          confirmed: 1,
        }
      }).done(function () {
        $("#conf-success").show();
      }).fail(function (xhr, status, error) {
        $("#conf-error").show();
      });
    }

  });
<\/script>
`;
  },
};
</script>
