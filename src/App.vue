<template>
  <v-app app>
    <app-navigation @search="doSearch"></app-navigation>
    <v-container
      v-if="showSearchResults"
      fluid
      style="position:relative; z-index:1;background-color:#f5f5f5"
      py-8
    >
      <v-layout justify-center>
        <v-flex>
          <div>
            <v-card class="mx-4 px-4 py-4">
              <div class="d-flex justify-end">
                <v-icon
                  class="d-flex justify-end display-1"
                  @click="showSearchResults = !showSearchResults"
                  >mdi-close-circle-outline</v-icon
                >
              </div>
              <div v-if="searchResultItems.length == 0">
                <h4>No Results Found</h4>
              </div>
              <v-list>
                <v-list-group
                  v-for="item in searchResultItems"
                  :key="item.title"
                  v-model="item.active"
                >
                  <div slot="activator">
                    <div>
                      <div>{{ item.title }}</div>
                    </div>
                  </div>
                  <div
                    v-for="subItem in item.items"
                    :key="subItem.title"
                    class="d-flex flex-column mx-12"
                    ripple
                    @click="close"
                  >
                    <div>
                      <div>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            navigate(
                              item.title.slice(0, -1) + 'Show',
                              subItem.id
                            )
                          "
                          >{{ subItem.name }}</v-btn
                        >
                      </div>
                    </div>
                  </div>
                </v-list-group>
              </v-list>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-content transition="slide-x-transition" style="padding-top:20px;">
      <div
        v-if="loading == true"
        style="position:absolute; top:0; left:0; bottom:0; right:0; z-index:2; background:#fafafa; height:100%; overflow:hidden; width:100%"
        id="loading"
      >
        <v-flex>
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
            style="display:block; margin:35vh auto 0"
          ></v-progress-circular>
        </v-flex>
      </div>
      <span v-if="alert.visible">
        <v-snackbar
          v-model="alert.visible"
          v-if="alert.type == 'success' && alert.message"
          bottom
          :timeout="3000"
        >
          {{ alert.message }}
          <v-btn dark @click="alert.visible = false">
            Close
          </v-btn>
        </v-snackbar>
      </span>
      <v-container v-if="alert.visible && alert.type == 'error'" pt-0>
        <v-flex>
          <v-alert
            v-model="alert.visible"
            :type="alert.type"
            dismissible
            v-for="message in alert.message"
            :key="message"
          >
            {{ message }}
          </v-alert>
        </v-flex>
      </v-container>
      <v-container fluid fill-height style="position:relative; z-index:1;" pt-0>
        <v-layout justify-center>
          <v-flex>
            <v-card flat id="router-view">
              <router-view></router-view>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import AppNavigation from "@/components/AppNavigation";

export default {
  name: "App",
  components: { AppNavigation },

  data: () => ({
    showSearchResults: false,
    searchResultItems: [],
  }),
  methods: {
    navigate(name, id) {
      this.showSearchResults = !this.showSearchResults;
      this.$router.push({ name: name, params: { id: id } });
    },

    close() {
      this.items.forEach((item) => {
        if (item.active) {
          return false;
        }
      });
    },

    doSearch: function(searchStr) {
      this.$store.dispatch(
        "search_results/getSearchResults",
        "search=" + searchStr
      );
      this.showSearchResults = !this.showSearchResults;
    },
  },
  computed: {
    ...mapGetters({
      alert: "global/alert",
      loading: "global/loading",
      authenticated: "auth/authenticated",
      searchResults: "search_results/search_results",
    }),
  },

  mounted() {
    this.$moment.tz.setDefault("UTC");
  },

  watch: {
    searchResults() {
      console.log("in search results");
      console.log(this.searchResults);
      console.log(this.searchResults.nonprofits);
      let results = [];
      if (this.searchResults.events) {
        let items = [];
        for (let i = 0; i < this.searchResults.events.data.length; i++) {
          items.push({
            id: this.searchResults.events.data[i].id,
            name: this.searchResults.events.data[i].name,
          });
        }

        results.push({
          title: "Events",
          active: true,
          items: items,
        });
      }

      if (this.searchResults.shifts) {
        let items = [];
        for (let i = 0; i < this.searchResults.shifts.data.length; i++) {
          items.push({
            id: this.searchResults.shifts.data[i].id,
            name: this.searchResults.shifts.data[i].name,
          });
        }

        results.push({
          title: "Shifts",
          active: true,
          items: items,
        });
      }

      if (this.searchResults.contacts) {
        let items = [];
        for (let i = 0; i < this.searchResults.contacts.data.length; i++) {
          items.push({
            id: this.searchResults.contacts.data[i].id,
            name: this.searchResults.contacts.data[i].name,
          });
        }

        results.push({
          title: "Contacts",
          active: true,
          items: items,
        });
      }

      if (this.searchResults.nonprofits) {
        let items = [];
        for (let i = 0; i < this.searchResults.nonprofits.data.length; i++) {
          items.push({
            id: this.searchResults.nonprofits.data[i].id,
            name: this.searchResults.nonprofits.data[i].name,
          });
        }

        results.push({
          title: "Nonprofits",
          active: true,
          items: items,
        });
      }

      if (this.searchResults.volunteers) {
        let items = [];
        for (let i = 0; i < this.searchResults.volunteers.data.length; i++) {
          items.push({
            id: this.searchResults.volunteers.data[i].id,
            name:
              this.searchResults.volunteers.data[i].first_name +
              " " +
              this.searchResults.volunteers.data[i].last_name,
          });
        }

        results.push({
          title: "Volunteers",
          active: true,
          items: items,
        });
      }

      if (this.searchResults.artists) {
        let items = [];
        for (let i = 0; i < this.searchResults.artists.data.length; i++) {
          items.push({
            id: this.searchResults.artists.data[i].id,
            name: this.searchResults.artists.data[i].name,
          });
        }

        results.push({
          title: "Artists",
          active: true,
          items: items,
        });
      }
      this.searchResultItems = results;
    },
  },
};
</script>
<style>
#router-view a,
.v-dialog__content a {
  text-decoration: none;
  color: black;
}
#router-view a {
  text-decoration: none;
  color: black;
}
#router-view table.v-table tbody td a {
  color: #424242;
}

.btn-secondary {
  color: rgba(0, 0, 0, 0.6);
  background-color: #eeeeee;
  border: 0.5px solid #d1d1d1;
  border-radius: 3px;
}
.btn-primary {
  color: #fff !important;
  border-radius: 3px !important;
  background-color: #0f7133 !important;
}

.form-filter {
  background: #fafafa;
  border: 1px solid #d1d1d1;
  border-radius: 3px;
  margin: 0 auto;
  padding: 0 1rem;
}

.v-tooltip__content {
  background: #ffffff !important;
  color: #000 !important;
  border-radius: 4px;
  border: 1px solid black;
  font-size: 14px;
  line-height: 22px;
  display: inline-block;
  padding: 15px 20px;
  position: absolute;
  text-transform: none;
  width: auto;
  opacity: 1 !important;
  pointer-events: none;
}

.v-tooltip__content:after,
.v-tooltip__content:before {
  bottom: 100%;
  left: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.v-tooltip__content:after {
  border-color: rgba(255, 255, 255, 0);
  border-bottom-color: #fff;
  border-width: 10px;
  margin-left: -10px;
}
.v-tooltip__content:before {
  border-color: rgba(82, 82, 82, 0);
  border-bottom-color: #525252;
  border-width: 11px;
  margin-left: -11px;
}

.v-tooltip__content p {
  margin-bottom: 10px;
}
.select-all-checkbox {
  margin-bottom: 0 !important;
}

.select-all-checkbox .v-messages {
  display: none;
}

.v-application .info {
  background-color: #2196f3 !important;
  border-color: #2196f3 !important;
}

.v-btn:before {
  background-color: transparent !important;
}

.header-toolbar-subtitle {
  font-size: 0.875rem;
}

.v-toolbar__title {
  line-height: 1;
}
.checkbox .v-messages {
  display: none !important;
}

.checkbox {
  margin-bottom: 0;
}

.subtitle {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.875rem;
  font-weight: 400;
  margin-top: 8px;
  line-height: 1.4;
}

.search-result {
  background-color: #f5f5f5 !important;
  border-color: #f5f5f5 !important;
  padding: 0.8rem 0;
  margin-bottom: 2rem;
  width: 100%;
  /*
  display: table;
  table-layout: fixed;
  */
  display: block;
  height: 100% !important;
}

.search-result--pending-volunteers {
  height: auto !important;
  flex-wrap: wrap;
}

.search-result .v-toolbar__content {
  margin-bottom: auto;
  margin-top: auto;
  flex-grow: 1;
  display: flex;
}

.search-result2 .v-toolbar__content {
  flex-wrap: wrap;
  justify-content: space-between;
}

.search-result--pending-volunteers .v-toolbar__content {
  flex-wrap: wrap;
  justify-content: space-between;
}

.select-all-checkbox .v-input__slot {
  margin-bottom: 0;
}

.ghost {
  opacity: 1;
  background: transparent;
  border: 3px dashed #757575;
}

.tooltip {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #fff;
  line-height: 1.5 !important;
}

.tooltip p {
  font-size: 0.875rem;
  margin-bottom: 0 !important;
}

.v-application a {
  text-decoration: none;
}

.v-toolbar__items .v-btn--active {
  background-color: rgb(215, 215, 215);
}

.shift-header .v-toolbar__content {
  flex-grow: 1;
}

.search-result .v-input__slot {
  margin-bottom: 0;
}
.search-result .checkbox {
  margin-bottom: 0;
}
.btn-tooltip {
  display: flex;
  font-size: 0.875rem;
  text-transform: none;
  height: auto !important;
}
.tooltip p {
  line-height: 1.5;
}

.capitalize {
  text-transform: capitalize;
}
.v-toolbar__content {
  height: 100% !important;
}
.full-width {
  width: 100%;
}
</style>
