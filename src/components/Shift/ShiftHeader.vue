<template>
  <div>
    <v-row>
      <v-toolbar flat class="grey lighten-4 mb-5">
        <v-toolbar-title>
          <strong v-if="!shift.event.teams">{{
            shift.start_date | moment("dddd MMM D, YYYY")
          }}</strong>
          <strong v-else>{{ shift.name }}</strong>
          <strong v-if="shift.venue && shift.venue.state && shift.venue.city">
            - {{ shift.venue.city }}, {{ shift.venue.state.abbreviation }}
          </strong>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down align-center">
          <v-btn text :to="{ name: 'ShiftShow', params: { id: shift.id } }">
            Volunteers
          </v-btn>
          <v-menu offset-y open-on-hover>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                Settings
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                :to="{ name: 'ShiftSettings', params: { id: shift.id } }"
              >
                <v-list-item-title>Edit Shift</v-list-item-title>
              </v-list-item>
              <v-list-item
                :to="{
                  name: 'ShiftEmailTemplates',
                  params: { event_id: shift.event.id, shift_id: shift.id },
                }"
              >
                <v-list-item-title>Email Templates</v-list-item-title>
              </v-list-item>
              <v-list-item
                :to="{
                  name: 'MetricsIndex',
                  params: { event_id: shift.event.id, shift_id: shift.id },
                }"
              >
                <v-list-item-title>Metrics</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn text @click="notesDialog = true">Notes</v-btn>
          <v-btn text @click="tagsDialog = true">Tags</v-btn>
          <v-dialog
            width="500px"
            style="background-color: #fff;"
            class="dialog"
            v-model="dialog"
            persistent
          >
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">Report</v-btn>
            </template>
            <v-card>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                v-on:submit.prevent="submit"
              >
                <v-container>
                  <v-row>
                    <v-col><h2>Report Shift Totals</h2></v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <div
                        v-for="(metric, index) in metricShiftData"
                        :key="index"
                      >
                        <v-text-field
                          v-model="metricShiftData[index].value"
                          :label="metric.name"
                          type="number"
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn
                        class="mr-4"
                        color="primary"
                        dark
                        @click="updateMetrics"
                        >Save</v-btn
                      >
                      <v-btn
                        depressed
                        class="mr-3 btn-secondary"
                        @click="dialog = false"
                        >Cancel</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-dialog>
          <v-btn v-if="showShiftEditIcon" icon @click="editShiftChange()"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
          <v-btn v-if="showShiftDeleteIcon" icon @click="deleteDialog = true"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
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
                ><router-link
                  :to="{ name: 'ShiftShow', params: { id: shift.id } }"
                  >Volunteers</router-link
                ></v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-menu offset-y open-on-hover>
                  <template v-slot:activator="{ on }">
                    <a text v-on="on">
                      Settings
                    </a>
                  </template>
                  <v-list>
                    <v-list-item
                      :to="{ name: 'ShiftSettings', params: { id: shift.id } }"
                    >
                      <v-list-item-title>Edit Shift</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :to="{
                        name: 'ShiftEmailTemplates',
                        params: {
                          event_id: shift.event.id,
                          shift_id: shift.id,
                        },
                      }"
                    >
                      <v-list-item-title>Email Templates</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :to="{
                        name: 'MetricsIndex',
                        params: {
                          event_id: shift.event.id,
                          shift_id: shift.id,
                        },
                      }"
                    >
                      <v-list-item-title>Metrics</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><a @click="notesDialog = true" href="#"
                  >Notes</a
                ></v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><a @click="tagsDialog = true" href="#"
                  >Tags</a
                ></v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-dialog
                  width="500px"
                  style="background-color: #fff;"
                  class="dialog"
                  v-model="dialog"
                  persistent
                >
                  <template v-slot:activator="{ on }">
                    <a text v-on="on">Report</a>
                  </template>
                  <v-card>
                    <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                      v-on:submit.prevent="submit"
                    >
                      <v-container>
                        <v-row>
                          <v-col><h2>Report Shift Totals</h2></v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <div
                              v-for="(metric, index) in metricShiftData"
                              :key="index"
                            >
                              <v-text-field
                                v-model="metricShiftData[index].value"
                                :label="metric.name"
                                type="number"
                              ></v-text-field>
                            </div>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-btn
                              class="mr-4"
                              color="primary"
                              dark
                              @click="updateMetrics"
                              >Save</v-btn
                            >
                            <v-btn
                              depressed
                              class="mr-3 btn-secondary"
                              @click="dialog = false"
                              >Cancel</v-btn
                            >
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card>
                </v-dialog>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-row>
    <v-chip
      class="mr-2 mb-2"
      color="blue-grey"
      text-color="white"
      v-if="!shift.event.teams"
    >
      <v-avatar left>
        <v-icon>mdi-alarm</v-icon>
      </v-avatar>
      <strong class="pr-1">Doors:</strong>
      {{ shift.doors }}
    </v-chip>
    <v-chip
      class="mr-2 mb-2"
      color="blue-grey"
      text-color="white"
      v-if="!shift.event.teams"
    >
      <v-avatar left>
        <v-icon>mdi-alarm</v-icon>
      </v-avatar>
      <strong class="pr-1">Check-In:</strong>
      {{ shift.check_in }}
    </v-chip>
    <v-chip
      class="mr-2 mb-2"
      color="blue-grey"
      text-color="white"
      v-if="shift.venue"
    >
      <v-avatar left>
        <v-icon>mdi-home</v-icon>
      </v-avatar>
      {{ formatVenueName(shift.venue) }}
    </v-chip>
    <div v-if="shift.event.teams" class="mt-2">
      <v-menu
        :open-on-hover="true"
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
          >
            <v-avatar left>
              <v-icon>mdi-alarm</v-icon>
            </v-avatar>
            <strong class="pr-1">Schedule</strong>
          </v-chip>
        </template>
        <div class="tooltip">
          <span v-if="shift.event.teams">
            <ul class="schedule-items-list">
              <li
                v-for="scheduleItem in shift.shift_schedules"
                :key="scheduleItem.id"
              >
                <strong>{{
                  scheduleItem.start_date | moment("dddd MMM D, YYYY")
                }}</strong
                ><br />Doors: {{ scheduleItem.doors }} | Check:
                {{ scheduleItem.check_in }}
              </li>
            </ul>
          </span>
        </div>
      </v-menu>
      <v-chip
        class="mr-2 mb-2"
        color="blue-grey"
        text-color="white"
        v-if="shift.venue"
      >
        <v-avatar left>
          <v-icon>mdi-home</v-icon>
        </v-avatar>
        {{ formatVenueName(shift.venue) }}
      </v-chip>
    </div>
    <NotesDialog
      :active="notesDialog"
      :noteableId="shift.id"
      noteableType="Shift"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="shift.id"
      tagableType="Shift"
      @close="tagsDialog = false"
    ></TagsDialog>
    <DeleteDialog
      :itemId="shift.id"
      :active="deleteDialog"
      redirect="EventShifts"
      :redirectParams="{ id: shift.event.id }"
      path="shifts/deleteShift"
      @close="deleteDialog = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NotesDialog from "@/components/Note/NotesDialog";
import TagsDialog from "@/components/Tag/TagsDialog";
import DeleteDialog from "@/components/DeleteDialog";

export default {
  name: "ShiftHeader",

  components: {
    NotesDialog,
    TagsDialog,
    DeleteDialog,
  },

  props: {
    shift: Object,
    shifts: Array,
    viewOnly: Boolean,
    showShiftEditIcon: {
      type: Boolean,
      default: false,
    },
    showShiftDeleteIcon: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      deleteDialog: false,
      postData: {
        metricsPostData: [],
      },
      metricShiftData: [],
      tagsDialog: false,
      notesDialog: false,
      dialog: false,
      valid: false,
    };
  },

  computed: {
    ...mapGetters({
      metrics: "metrics/metrics",
      metricValues: "metric_values/metric_values",
    }),
  },

  methods: {
    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else return venue.name;
    },

    editShiftChange() {
      this.viewOnly = !this.viewOnly;
      this.$emit("updateShift", this.viewOnly);
    },
    updateMetrics() {
      let payload = {
        metrics: this.metricShiftData,
      };

      if (this.$refs.form.validate()) {
        this.$store.dispatch("metric_values/updateMetricValues", payload);
        this.dialog = false;
      }
    },

    updateShift() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("shifts/updateShift", this.shift);
        this.dialog = false;
      }
    },
  },

  watch: {
    metrics() {
      //load all shift metric fields to metricData array,
      //if the field is already in the array then update it
      for (let i = 0; i < this.metrics.length; i++) {
        if (this.metrics[i].metric_type == "Shift") {
          if (
            !this.metricShiftData.some(
              (item) =>
                item.metric_id === this.metrics[i].id &&
                this.metrics[i].metric_type == "Shift"
            )
          ) {
            let id = null;
            if (this.metrics[i].metric_type == "Event")
              id = this.shift.event.id;
            else id = this.shift.id;

            this.metricShiftData.push({
              name: this.metrics[i].name,
              metric_id: this.metrics[i].id,
              metricable_id: id,
              metricable_type: this.metrics[i].metric_type,
              value: 0,
            });
          }
        }
      }
    },

    metricValues() {
      //load all event metric_values fields to metricData array
      //if the field is already in the array then update it
      for (let i = 0; i < this.metricValues.length; i++) {
        if (
          this.metricValues[i].metricable_type == "Shift" &&
          this.metricValues[i].metric.active
        ) {
          if (
            this.metricShiftData.some(
              (item) =>
                item.metric_id === this.metricValues[i].metric_id &&
                item.metricable_id === this.metricValues[i].metricable_id &&
                item.metricable_type === this.metricValues[i].metricable_type
            )
          ) {
            for (let j = 0; j < this.metricShiftData.length; j++) {
              if (
                this.metricShiftData[j].metric_id ==
                  this.metricValues[i].metric_id &&
                this.metricShiftData[j].metricable_id ==
                  this.metricValues[i].metricable_id &&
                this.metricShiftData[j].metricable_type ==
                  this.metricValues[i].metricable_type
              ) {
                this.metricShiftData[j].value = this.metricValues[i].value;
              }
            }
          } else {
            this.metricShiftData.push({
              name: this.metricValues[i].metric.name,
              metric_id: this.metricValues[i].metric_id,
              metricable_id: this.metricValues[i].metricable_id,
              metricable_type: this.metricValues[i].metricable_type,
              value: this.metricValues[i].value,
            });
          }
        }
      }
    },
  },

  mounted() {
    this.$store.dispatch(
      "metric_values/searchMetricValuesNoPaginate",
      "filter[metricable_id]=" +
        this.shift.id +
        "&filter[metricable_type]=Shift"
    );
  },
};
</script>

<style scoped>
.dialog {
  background-color: #fff !important;
}
.teams {
  display: flex;
  flex-grow: 1;
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
</style>
