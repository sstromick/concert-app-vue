<template>
  <v-container fluid v-if="event">
    <v-toolbar flat class="grey lighten-4">
      <v-toolbar-title>{{ event.name }} - New Shift</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text color="primary" @click="$router.go(-1)" exact>Back</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent="submit"
    >
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="formData.artist_id"
              :items="artists"
              label="Artist"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="formData.venue_id"
              :items="venues"
              label="Venue"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :rules="[(v) => !!v || 'required']"
            >
            </v-autocomplete>
            <v-text-field
              v-model="formData.volunteer_cap"
              label="Volunteer Cap"
            ></v-text-field>
            <v-text-field v-model="formData.item" label="Item"></v-text-field>
            <v-text-field
              v-model="formData.name"
              label="Shift Name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <template v-if="event.teams">
              <h4 class="mb-2"><strong>Shift Schedules</strong></h4>
              <v-toolbar
                flat
                class="grey lighten-4 mb-4 d-flex flex-grow-1 align-center schedules"
                v-for="schedule in formData.shift_schedules"
                :key="schedule.id"
              >
                <v-toolbar-title class="flex-grow-1"
                  >{{ schedule.start_date | moment("MMM D, YYYY") }} -
                  {{ schedule.end_date | moment("MMM D, YYYY") }}
                  <div class="mt-4">
                    <template>
                      <v-chip class="mr-2" color="blue-grey" text-color="white">
                        <v-avatar left>
                          <v-icon>mdi-alarm</v-icon>
                        </v-avatar>
                        <strong class="pr-1">Doors:</strong>
                        {{ schedule.doors }}
                      </v-chip>
                      <v-chip class="mr-2" color="blue-grey" text-color="white">
                        <v-avatar left>
                          <v-icon>mdi-alarm</v-icon>
                        </v-avatar>
                        <strong class="pr-1">Check-In:</strong>
                        {{ schedule.check_in }}
                      </v-chip>
                    </template>
                  </div>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  depressed
                  primary
                  class="primary"
                  @click.stop="showDialog(schedule)"
                  >Edit</v-btn
                >
              </v-toolbar>
              <v-btn
                depressed
                color="primary"
                class="btn-primary"
                @click="showDialog()"
              >
                Add Shift Schedule
              </v-btn>
              <v-dialog v-model="dialog" max-width="500">
                <v-card>
                  <v-card-title class="headline"
                    >Edit Shift Schedule</v-card-title
                  >
                  <v-card-text>
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
                          v-model="scheduleId"
                          label="Id"
                          readonly
                          class="hidden"
                        ></v-text-field>
                        <v-text-field
                          v-model="startDate"
                          label="Start Date"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="startDate"
                        @input="menuStartDate = false"
                      ></v-date-picker>
                    </v-menu>
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
                          v-model="endDate"
                          label="End Date"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="endDate"
                        @input="menuEndDate = false"
                      ></v-date-picker>
                    </v-menu>
                    <v-row dense>
                      <v-col cols="12" md="6" class="py-0">
                        <v-row dense>
                          <v-col cols="4" class="py-0">
                            <v-autocomplete
                              v-model="doorsHour"
                              :items="hours"
                              item-text="hour"
                              item-value="id"
                              label="Doors"
                              :rules="[(v) => !!v || 'required']"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="4" class="py-0 pr-2">
                            <v-autocomplete
                              v-model="doorsMinute"
                              :items="minutes"
                              item-text="minute"
                              item-value="id"
                              label="Minutes"
                              :rules="[(v) => !!v || 'required']"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="4" class="py-0 pr-2">
                            <v-autocomplete
                              v-model="doorsAmPm"
                              :items="ampm"
                              item-text="am / pm"
                              item-value="id"
                              label="am / pm"
                              :rules="[(v) => !!v || 'required']"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" md="6" class="py-0">
                        <v-row>
                          <v-col cols="4" class="py-0 pl-2">
                            <v-autocomplete
                              v-model="checkinHour"
                              :items="hours"
                              item-text="hour"
                              item-value="id"
                              label="Check-In"
                              :rules="[(v) => !!v || 'required']"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="4" class="py-0">
                            <v-autocomplete
                              v-model="checkinMinute"
                              :items="minutes"
                              item-text="minute"
                              item-value="id"
                              label="Minutes"
                              :rules="[(v) => !!v || 'required']"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="4" class="py-0 pr-2">
                            <v-autocomplete
                              v-model="checkinAmPm"
                              :items="ampm"
                              item-text="am / pm"
                              item-value="id"
                              label="am / pm"
                              :rules="[(v) => !!v || 'required']"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      depressed
                      class="mr-3 btn-secondary"
                      @click="dialog = false"
                    >
                      Cancel
                    </v-btn>

                    <v-btn
                      depressed
                      color="primary"
                      class="btn-primary"
                      @click="saveSchedule()"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>

            <template v-if="!event.teams">
              <v-menu
                v-if="!event.teams"
                v-model="menuStartDate2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formData.start_date"
                    label="Start Date"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.start_date"
                  @input="menuStartDate2 = false"
                ></v-date-picker>
              </v-menu>
              <v-menu
                v-if="!event.teams"
                v-model="menuEndDate2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formData.end_date"
                    label="End Date"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.end_date"
                  @input="menuEndDate2 = false"
                ></v-date-picker>
              </v-menu>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="doorsHour"
                    :items="hours"
                    item-text="hour"
                    item-value="id"
                    label="Doors"
                    :rules="[(v) => !!v || 'required']"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="doorsMinute"
                    :items="minutes"
                    item-text="minute"
                    item-value="id"
                    label="Minutes"
                    :rules="[(v) => !!v || 'required']"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="4" class="py-0 pr-2">
                  <v-autocomplete
                    v-model="doorsAmPm"
                    :items="ampm"
                    item-text="am / pm"
                    item-value="id"
                    label="am / pm"
                    :rules="[(v) => !!v || 'required']"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="checkinHour"
                    :items="hours"
                    item-text="hour"
                    item-value="id"
                    label="Check-In"
                    :rules="[(v) => !!v || 'required']"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="checkinMinute"
                    :items="minutes"
                    item-text="minute"
                    item-value="id"
                    label="Minutes"
                    :rules="[(v) => !!v || 'required']"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="4" class="py-0 pr-2">
                  <v-autocomplete
                    v-model="checkinAmPm"
                    :items="ampm"
                    item-text="am / pm"
                    item-value="id"
                    label="am / pm"
                    :rules="[(v) => !!v || 'required']"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-btn
      color="green"
      dark
      small
      fixed
      bottom
      right
      fab
      @click="submit"
      success
      v-if="valid == true"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ShiftNew",
  data: () => ({
    valid: false,
    dialog: false,
    menuStartDate: null,
    menuEndDate: null,
    menuStartDate2: null,
    menuEndDate2: null,
    scheduleId: "",
    startDate: "",
    endDate: "",
    doorsHour: "",
    doorsMinute: "",
    doorsAmPm: "",
    checkinHour: "",
    checkinMinute: "",
    checkinAmPm: "",
    hours: [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ],

    minutes: ["00", "15", "30", "45"],
    ampm: ["AM", "PM"],

    formData: {
      event_id: "",
      venu_id: "",
      artist_id: "",
      name: "",
      start_date: "",
      end_date: "",
      doors: "",
      check_in: "",
      hours_worked: "",
      volunteer_cap: "",
      item: "",
      item_sold: "",
      item_bof_free: "",
      item_revenue_cash: "",
      item_revenue_cc: "",
      biod_gallons: "",
      compost_gallons: "",
      water_foh_gallons: "",
      water_boh_gallons: "",
      farms_supported: "",
      tickets_sold: "",
      shift_schedules: [],
    },
  }),
  computed: {
    ...mapGetters({
      shift: "shifts/shift",
      event: "events/event",
      artists: "artists/artists",
      venues: "venues/venues",
    }),
  },
  methods: {
    addSchedule() {
      this.formData.shift_schedules.push({
        start_date: this.startDate,
        end_date: this.endDate,
        doors: this.doorsHour + ":" + this.doorsMinute + " " + this.doorsAmPm,
        check_in:
          this.checkinHour + ":" + this.checkinMinute + " " + this.checkinAmPm,
      });

      this.dialog = false;
    },

    saveSchedule() {
      if (this.$refs.form.validate()) {
        if (this.scheduleId == 0) {
          this.addSchedule();
        } else {
          for (var i = 0; i < this.formData.shift_schedules.length; i++) {
            if (this.formData.shift_schedules[i].id == this.scheduleId) {
              this.formData.shift_schedules[i].start_date = this.startDate;
              this.formData.shift_schedules[i].end_date = this.endDate;
              this.formData.shift_schedules[i].doors =
                this.doorsHour + ":" + this.doorsMinute + " " + this.doorsAmPm;
              this.formData.shift_schedules[i].check_in =
                this.checkinHour +
                ":" +
                this.checkinMinute +
                " " +
                this.checkinAmPm;
              break;
            }
          }
        }

        this.$refs.form.resetValidation();
        this.dialog = false;
      }
    },

    showDialog(schedule = null) {
      this.$refs.form.resetValidation();

      if (schedule) {
        this.scheduleId = schedule.id;
        this.startDate = schedule.start_date;
        this.endDate = schedule.end_date;

        let timeSplit = schedule.doors.split(/[\s:]+/);

        if (timeSplit.length) {
          this.doorsHour = timeSplit[0];
          this.doorsMinute = timeSplit[1];
          this.doorsAmPm = timeSplit[2];
        }

        timeSplit = schedule.check_in.split(/[\s:]+/);

        if (timeSplit.length) {
          this.checkinHour = timeSplit[0];
          this.checkinMinute = timeSplit[1];
          this.checkinAmPm = timeSplit[2];
          this.doorsAmPm = "AM";
        }
      } else {
        this.scheduleId = 0;
        this.startDate = "";
        this.endDate = "";
        this.doorsHour = "";
        this.doorsMinute = "00";
        this.checkinHour = "";
        this.checkinMinute = "00";
        this.checkinAmPm = "PM";
      }

      this.dialog = true;
    },

    submit() {
      if (this.$refs.form.validate()) {
        if (!this.event.teams) {
          if (this.doorsAmPm == "PM")
            this.formData.doors =
              parseInt(this.doorsHour) + 12 + ":" + this.doorsMinute + ":00";
          else
            this.formData.doors =
              this.doorsHour + ":" + this.doorsMinute + ":00";

          if (this.checkinAmPm == "PM")
            this.formData.check_in =
              parseInt(this.checkinHour) +
              12 +
              ":" +
              this.checkinMinute +
              ":00";
          else
            this.formData.check_in =
              this.checkinHour + ":" + this.checkinMinute + ":00";
        }

        this.$store.dispatch("shifts/createShift", this.formData);
      }
    },
  },

  watch: {
    formData: {
      handler(val) {
        if (!val.end_date) {
          this.formData.end_date = val.start_date;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.checkinMinute = "00";
    this.doorsMinute = "00";
    this.$store.dispatch("events/getEventList");
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("venues/getVenueList");
    this.formData.event_id = this.$route.params.id;
    if (this.event) {
      this.formData.artist_id = this.event.artist.id;
      this.formData.venue_id = this.event.venue.id;
      this.formData.event_id = this.event.id;
    }
  },
};
</script>

<style>
.schedules .v-toolbar__content {
  flex-grow: 1;
}

.hidden {
  display: none;
}
</style>
