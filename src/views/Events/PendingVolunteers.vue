<template>
  <v-container fluid v-if="volunteerShifts">
    <v-row>
      <v-col cols="12" lg="9">
        <h1 class="mb-6">Pending Volunteers</h1>
        <v-row>
          <v-col cols="12" lg="4" class="d-flex align-center">
            <v-btn light class="mr-3" color="primary" @click="batchUpdate()">
              Batch Update
            </v-btn>
            <v-combobox
              v-model="batchUpdateMode"
              :items="updateModes"
              outlined
              hide-details
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row v-for="item in volunteerShifts.data" :key="item.id">
          <v-col cols="12">
            <v-toolbar
              flat
              class="search-result search-result--pending-volunteers pending-volunteers__event"
            >
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
              <div class="d-flex flex-wrap">
                <div class="my-auto mx-4">
                  <v-icon v-if="item.teams">mdi-account-multiple</v-icon>
                  <v-icon v-else>mdi-account</v-icon>
                </div>
                <div class="my-auto m-x-4">
                  <v-chip
                    class="mb-2"
                    color="green"
                    text-color="white"
                    v-if="checkActive(item)"
                    >Active</v-chip
                  >
                  <v-chip
                    class="mb-2"
                    text-color="green"
                    v-if="!checkActive(item)"
                    >Inactive</v-chip
                  >
                </div>
              </div>
            </v-toolbar>
            <v-row
              class="shift"
              v-for="shift in filteredShifts(item.shifts)"
              :key="shift.id"
            >
              <v-col cols="12">
                <v-toolbar
                  flat
                  class="search-result search-result2 pending-volunteers__shift"
                >
                  <v-toolbar-title class="flex-grow-1">
                    <router-link
                      :to="{
                        name: 'ShiftShow',
                        params: { id: shift.event_id, shift_id: shift.id },
                      }"
                      class="flex flex-grow-1"
                    >
                      <strong v-if="shift.name">{{ shift.name }}</strong>
                      <strong v-else>
                        {{
                          shift.start_date | moment("dddd MMM D, YYYY")
                        }}</strong
                      >
                      <strong
                        v-if="
                          shift.venue && shift.venue.state && shift.venue.city
                        "
                      >
                        - {{ shift.venue.city }},
                        {{ shift.venue.state.abbreviation }}
                      </strong>
                    </router-link>
                  </v-toolbar-title>
                  <div class="d-flex flex-wrap">
                    <div class="my-auto mx-4">
                      <v-icon
                        @click="showModal(shift.id, shift.event_id)"
                        color="primary"
                        >mdi-email</v-icon
                      >
                    </div>
                    <div class="my-auto mx-4">
                      <div class="subheading font-weight-bold text-center">
                        {{ acceptedCount(shift.volunteer_shifts) }}
                      </div>
                      <div>Accepted</div>
                    </div>
                    <div class="my-auto mx-4">
                      <div class="subheading font-weight-bold text-center">
                        {{ waitlistCount(shift.volunteer_shifts) }}
                      </div>
                      <div>Waitlist</div>
                    </div>
                  </div>
                </v-toolbar>
                <v-row
                  class="volunteer-shift"
                  v-for="vs in filteredVS(shift.volunteer_shifts)"
                  :key="vs.id"
                >
                  <v-col cols="12">
                    <v-toolbar
                      flat
                      class="search-result search-result2 pending-volunteers__volunteer"
                      v-if="vs.volunteer"
                    >
                      <v-checkbox
                        class="checkbox"
                        v-model="selectedVolunteerShifts"
                        :value="vs.id"
                      ></v-checkbox>
                      <v-toolbar-title class="flex-grow-1">
                        <router-link
                          :to="{
                            name: 'VolunteerShow',
                            params: { id: vs.volunteer_id },
                          }"
                          class="flex flex-grow-1"
                        >
                          <v-menu :open-on-hover="true" :offset-y="true">
                            <template v-slot:activator="{ on }">
                              <strong v-on="on">{{
                                vs.volunteer.first_name +
                                  " " +
                                  vs.volunteer.last_name
                              }}</strong>
                            </template>
                            <v-list>
                              <v-list-item>
                                {{ vs.note }}
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </router-link>
                      </v-toolbar-title>
                      <div class="d-flex flex-wrap">
                        <v-icon
                          class="my-auto mx-4"
                          @click="showDialog(vs.volunteer.email)"
                          color="primary"
                          >mdi-email</v-icon
                        >
                        <v-btn @click="acceptedClick([vs.id])" text
                          >Accept</v-btn
                        >
                        <v-btn @click="rejectClick([vs.id])" text>Reject</v-btn>
                        <v-btn @click="waitlistClick([vs.id])" text
                          >Add to Waitlist</v-btn
                        >
                        <v-btn
                          @click="deleteVolunteerClick(vs.volunteer.id)"
                          text
                          >Delete Volunteer</v-btn
                        >
                        <v-btn @click="removeApplicationClick(vs.id)" text
                          >Remove Application</v-btn
                        >
                      </div>
                    </v-toolbar>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-pagination
            v-model="page"
            :length="volunteerShifts.last_page"
            :total-visible="15"
          ></v-pagination>
        </v-row>
        <EmailDialog
          :active="emailDialog"
          :shiftId="selectedShiftId"
          :eventId="selectedEventId"
          @close="emailDialog = false"
        ></EmailDialog>
        <BasicEmailDialog
          :active="basicEmailDialog"
          :to="emailTo"
          @close="basicEmailDialog = false"
        ></BasicEmailDialog>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card color="blue-grey lighten-5" flat>
          <v-card-title>Filter Pending Volunteers</v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
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
import moment from "moment";
import EmailDialog from "@/components/EmailDialog/EmailDialog";
import BasicEmailDialog from "@/components/EmailDialog/BasicEmailDialog";
import axios from "axios";

export default {
  name: "EventShifts",
  components: {
    EmailDialog,
    BasicEmailDialog,
  },

  data: () => ({
    dialog: false,
    search: "",
    emailTo: null,
    valid: false,
    selectedShiftId: 0,
    selectedEventId: 0,
    active: 0,
    basicEmailDialog: false,
    emailDialog: false,
    page: 1,
    query: {
      eventFilter: null,
    },
    menuStartDate: false,
    menuEndDate: false,
    volunteerShiftData: {
      accepted_ids: [],
      declined_ids: [],
      waitlist_ids: [],
      nonprofit_ids: [],
    },
    selectedVolunteerShifts: [],
    updateModes: [
      "Accept",
      "Reject",
      "Add To Waitlist",
      "Delete Volunteer",
      "Remove Application",
    ],
    batchUpdateMode: "Accept",
  }),
  computed: {
    ...mapGetters({
      volunteerShifts: "volunteer_shifts/volunteer_shifts",
      events: "events/events",
    }),
  },

  methods: {
    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else
        return venue.name;
    },

    eventArtistTitle(item) {
      return item.name + " - " + item.artist.name;
    },

    filteredShifts(shifts) {
      return shifts.filter((item) => {
        let pending = false;
        for (let i = 0; i < item.volunteer_shifts.length; i++) {
          if (item.volunteer_shifts[i].pending == 1) {
            pending = true;
          }
        }
        if (item.volunteer_shifts.length && pending) return true;
        else return false;
      });
    },

    filteredVS(shifts) {
      return shifts.filter((item) => {
        return item.volunteer && item.pending;
      });
    },

    clear() {
      this.query.eventFilter = null;
      this.page = 1;
      this.submit(true);
    },

    acceptedClick(ids) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      ids.forEach((element) => {
        this.volunteerShiftData.accepted_ids.push({
          id: element,
        });
      });

      axios
        .post("/volunteershifts-update-status/", this.volunteerShiftData)
        .then(() => {
          axios
            .get("/volunteershifts-pending/")
            .then((response) => {
              this.$store.commit(
                "volunteer_shifts/VOLUNTEER_SHIFTS_UPDATED",
                response.data,
                { root: true }
              );
              this.$store.commit(
                "global/ALERT_UPDATED",
                {
                  visible: true,
                  message: ["Update Sucessful"],
                  type: "success",
                },
                { root: true }
              );
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },

    rejectClick(ids) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      //this.volunteerShiftData.declined_ids.push(id);
      ids.forEach((element) => {
        this.volunteerShiftData.declined_ids.push(element);
      });

      axios
        .post("/volunteershifts-update-status/", this.volunteerShiftData)
        .then(() => {
          axios
            .get("/volunteershifts-pending/")
            .then((response) => {
              this.$store.commit(
                "volunteer_shifts/VOLUNTEER_SHIFTS_UPDATED",
                response.data,
                { root: true }
              );
              this.$store.commit(
                "global/ALERT_UPDATED",
                {
                  visible: true,
                  message: ["Update Sucessful"],
                  type: "success",
                },
                { root: true }
              );
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },

    waitlistClick(ids) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      //this.volunteerShiftData.waitlist_ids.push(id);
      ids.forEach((element) => {
        this.volunteerShiftData.waitlist_ids.push(element);
      });

      axios
        .post("/volunteershifts-update-status/", this.volunteerShiftData)
        .then(() => {
          axios
            .get("/volunteershifts-pending/")
            .then((response) => {
              this.$store.commit(
                "volunteer_shifts/VOLUNTEER_SHIFTS_UPDATED",
                response.data,
                { root: true }
              );
              this.$store.commit(
                "global/ALERT_UPDATED",
                {
                  visible: true,
                  message: ["Update Sucessful"],
                  type: "success",
                },
                { root: true }
              );
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },

    deleteVolunteersBatch(ids) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      axios
        .post("/volunteers-mass-delete/", { volunteerShifts: ids })
        .then(() => {
          axios
            .get("/volunteershifts-pending/")
            .then((response) => {
              this.$store.commit(
                "volunteer_shifts/VOLUNTEER_SHIFTS_UPDATED",
                response.data,
                { root: true }
              );
              this.$store.commit(
                "global/ALERT_UPDATED",
                {
                  visible: true,
                  message: ["Update Sucessful"],
                  type: "success",
                },
                { root: true }
              );
            })
            .catch((error) => {
              console.log("error occured");
              console.log(error);
              this.$store.commit(
                "global/ALERT_UPDATED",
                {
                  visible: true,
                  message: ["Update Failed"],
                  type: "error",
                },
                { root: true }
              );
            });
        });
    },

    deleteVolunteerClick(id) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      axios.delete("/volunteers/" + id).then(() => {
        axios
          .get("/volunteershifts-pending/")
          .then((response) => {
            this.$store.commit(
              "volunteer_shifts/VOLUNTEER_SHIFTS_UPDATED",
              response.data,
              { root: true }
            );
            this.$store.commit(
              "global/ALERT_UPDATED",
              {
                visible: true,
                message: ["Update Sucessful"],
                type: "success",
              },
              { root: true }
            );
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },

    removeApplicationClick(id) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      axios.delete("/volunteershifts/" + id).then(() => {
        axios
          .get("/volunteershifts-pending/")
          .then((response) => {
            this.$store.commit(
              "volunteer_shifts/VOLUNTEER_SHIFTS_UPDATED",
              response.data,
              { root: true }
            );
            this.$store.commit(
              "global/ALERT_UPDATED",
              {
                visible: true,
                message: ["Update Sucessful"],
                type: "success",
              },
              { root: true }
            );
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },

    removeApplicationsBatch(ids) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      axios
        .post("/volunteershifts-mass-delete/", { volunteerShifts: ids })
        .then(() => {
          axios
            .get("/volunteershifts-pending/")
            .then((response) => {
              this.$store.commit(
                "volunteer_shifts/VOLUNTEER_SHIFTS_UPDATED",
                response.data,
                { root: true }
              );
              this.$store.commit(
                "global/ALERT_UPDATED",
                {
                  visible: true,
                  message: ["Update Sucessful"],
                  type: "success",
                },
                { root: true }
              );
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },

    showModal(shiftId, eventId) {
      this.selectedShiftId = shiftId;
      this.selectedEventId = eventId;
      this.emailDialog = true;
    },

    showDialog(email) {
      this.emailTo = email;
      this.basicEmailDialog = true;
    },

    checkAll() {
      this.query.ids = [];

      if (this.query.allSelected) {
        for (let s in this.shifts.data) {
          this.query.ids.push(this.shifts.data[s].id);
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
          process.env.VUE_APP_API_URL + "/shifts-export?filter[id]=" + ids;
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

    acceptedCount(shifts) {
      let count = 0;
      for (let i = 0; i < shifts.length; i++) {
        count += shifts[i].accepted;
      }

      return count;
    },

    waitlistCount(shifts) {
      let count = 0;
      for (let i = 0; i < shifts.length; i++) {
        count += shifts[i].waitlist;
      }

      return count;
    },

    convertTime(input) {
      return moment(input, "HH:mm:ss").format("h:mm A");
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },

    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },

    getFilter() {
      let eventFilter =
        this.query.eventFilter != null
          ? "&event-id=" + this.query.eventFilter
          : "";

      return eventFilter;
    },

    submit(reset_pagination) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      let pageFilter = this.page != null ? "?page=" + this.page : "";

      if (reset_pagination) {
        pageFilter = "";
        this.page = 1;
      }

      let filter = pageFilter + this.getFilter();

      this.$store.dispatch("volunteer_shifts/searchPending", filter);
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

    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }

      return null;
    },

    batchUpdate() {
      switch (this.batchUpdateMode) {
        case "Accept":
          this.acceptedClick(this.selectedVolunteerShifts);
          break;
        case "Reject":
          this.rejectClick(this.selectedVolunteerShifts);
          break;
        case "Add To Waitlist":
          this.waitlistClick(this.selectedVolunteerShifts);
          break;
        case "Delete Volunteer":
          this.deleteVolunteersBatch(this.selectedVolunteerShifts);
          break;
        case "Remove Application":
          this.removeApplicationsBatch(this.selectedVolunteerShifts);
          break;
      }

      this.selectedVolunteerShifts = [];
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
      this.$store.dispatch("events/getEventList");
    },
  },

  mounted() {
    this.$store.dispatch("volunteer_shifts/getPending");
    this.$store.dispatch("events/getEventList");
  },
};
</script>

<style scoped>
.card-router-link {
  text-decoration: underline !important;
}

.schedule-items-list {
  list-style: none;
  padding-left: 0 !important;
}
.schedule-items-list li {
  margin-bottom: 1rem !important;
}
.schedule-items-list li:last-child {
  margin-bottom: 0 !important;
}

.v-card__subtitle {
  padding-top: 0 !important;
}
.v-toolbar__content {
  padding-bottom: 0 !important;
}

.shift {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.event {
  display: flex;
  flex-direction: column;
}
.volunteer-shift {
}

.pending-volunteers__event {
  background-color: #cecece !important;
}
.pending-volunteers__shift {
  background-color: #dbdbdb !important;
}
.pending-volunteers__volunteer {
  background-color: #f5f5f5 !important;
}

.pending-volunteers__event .v-toolbar__title a {
  color: #0f7133 !important;
}
</style>
