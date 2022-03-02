<template>
  <div>
    <v-row>
      <v-toolbar flat class="grey lighten-4 mb-3">
        <v-avatar class="mr-2" @click="photoDialog = true">
          <v-img
            :src="awsUrl + '/events/' + event.photo_url"
            aspect-ratio="1"
            v-if="event.photo_url"
          ></v-img>
          <v-icon x-large v-else>mdi-camera</v-icon>
        </v-avatar>
        <v-toolbar-title>
          <router-link :to="{ name: 'EventShifts', params: { id: event.id } }">
            <strong v-if="event.artist">{{ event.artist.name }} - </strong>
            <strong>{{ event.name }}</strong>
          </router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text :to="{ name: 'EventShifts', params: { id: event.id } }"
            >Shifts</v-btn
          >
          <v-menu offset-y open-on-hover>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                Settings
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                :to="{ name: 'EventShow', params: { id: event.id } }"
              >
                <v-list-item-title>Edit Event</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="$route.params.shift_id"
                :to="{
                  name: 'EventEmailTemplates',
                  params: { event_id: event.id, from_shift: true },
                }"
              >
                <v-list-item-title>Email Templates</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-else
                :to="{
                  name: 'EventEmailTemplates',
                  params: { event_id: event.id, from_shift: false },
                }"
              >
                <v-list-item-title>Email Templates</v-list-item-title>
              </v-list-item>
              <v-list-item
                :to="{ name: 'EventAddVolunteer', params: { id: event.id } }"
                v-if="!event.teams"
              >
                <v-list-item-title>Embed Form</v-list-item-title>
              </v-list-item>
              <v-list-item
                :to="{
                  name: 'EventAddTeamVolunteer',
                  params: { id: event.id },
                }"
                v-else
              >
                <v-list-item-title>Embed Form</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-if="$route.params.shift_id"
                :to="{
                  name: 'MetricsIndex',
                  params: { event_id: event.id, from_shift: true },
                }"
              >
                <v-list-item-title>Metrics</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-else
                :to="{
                  name: 'MetricsIndex',
                  params: { event_id: event.id, from_shift: false },
                }"
              >
                <v-list-item-title>Metrics</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn text @click="notesDialog = true">Notes</v-btn>
          <v-btn text @click="tagsDialog = true">Tags</v-btn>
          <v-dialog
            style="background-color: #fff;"
            class="dialog"
            v-model="dialog"
            persistent
            max-width="500"
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
                    <v-col><h2>Report Event Totals</h2></v-col>
                  </v-row>
                  <v-row>
                    <v-col lg="12">
                      <div v-for="(metric, index) in metricData" :key="index">
                        <v-text-field
                          v-model="metricData[index].value"
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
          <v-btn text @click="photoDialog = true">Photo</v-btn>
          <v-btn v-if="showEditIcon" icon @click="editChange()"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
          <v-btn icon @click="deleteDialog = true"
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
                  :to="{ name: 'EventShifts', params: { id: event.id } }"
                  >Shifts</router-link
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
                      :to="{ name: 'EventShow', params: { id: event.id } }"
                    >
                      <v-list-item-title>Edit Event</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="$route.params.shift_id"
                      :to="{
                        name: 'EventEmailTemplates',
                        params: { event_id: event.id, from_shift: true },
                      }"
                    >
                      <v-list-item-title>Email Templates</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-else
                      :to="{
                        name: 'EventEmailTemplates',
                        params: { event_id: event.id, from_shift: false },
                      }"
                    >
                      <v-list-item-title>Email Templates</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :to="{
                        name: 'EventAddVolunteer',
                        params: { id: event.id },
                      }"
                      v-if="!event.teams"
                    >
                      <v-list-item-title>Embed Form</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :to="{
                        name: 'EventAddTeamVolunteer',
                        params: { id: event.id },
                      }"
                      v-else
                    >
                      <v-list-item-title>Embed Form</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="$route.params.shift_id"
                      :to="{
                        name: 'MetricsIndex',
                        params: { event_id: event.id, from_shift: true },
                      }"
                    >
                      <v-list-item-title>Metrics</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-else
                      :to="{
                        name: 'MetricsIndex',
                        params: { event_id: event.id, from_shift: false },
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
                  style="background-color: #fff;"
                  class="dialog"
                  v-model="dialog"
                  persistent
                  max-width="500"
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
                          <v-col><h2>Report Event Totals</h2></v-col>
                        </v-row>
                        <v-row>
                          <v-col lg="12">
                            <div
                              v-for="(metric, index) in metricData"
                              :key="index"
                            >
                              <v-text-field
                                v-model="metricData[index].value"
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
            <v-list-item>
              <v-list-item-title
                ><a @click="photoDialog = true" href="#"
                  >Photo</a
                ></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-row>
    <v-menu
      :open-on-hover="true"
      :offset-y="true"
      class="tooltip-menu"
      max-width="99%"
      v-if="contacts.data.length"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          class="mr-2 mb-2"
          color="blue-grey"
          text-color="white"
          v-on="on"
        >
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          Contacts
        </v-chip>
      </template>
      <div class="tooltip">
        <span v-for="(c, index) in contacts.data" :key="index">
          <div class="subtitle my-2 d-flex flex-column">
            <span>{{ c.contact_master.name }}</span>
            <span v-if="c.contact_master.title">{{
              c.contact_master.title
            }}</span>
            <v-btn
              text
              class="px-0 py-1 primary--text btn-tooltip justify-start"
              @click.stop="showDialog(c.contact_master.email)"
            >
              {{ c.contact_master.email }}
            </v-btn>
            {{ formatPhoneNumber(c.contact_master.phone) }}
            <div class="d-flex mt-3 mb-3">
              <v-btn
                class="px-0 py-1 primary--text btn-tooltip mr-3"
                @click.stop="showContactDialog(c, false)"
              >
                Edit
              </v-btn>
              <v-btn
                class="px-0 py-1 primary--text btn-tooltip"
                @click.stop="showDeleteDialog(c.id)"
              >
                Delete
              </v-btn>
            </div>
          </div>
        </span>
      </div>
    </v-menu>
    <v-chip
      class="mr-2 mb-2"
      color="blue-grey"
      @click.stop="showContactDialog(null, true)"
      outlined
    >
      <v-icon left>mdi-wrench</v-icon>
      Add Contact
    </v-chip>
    <v-chip
      class="mr-2 mb-2"
      color="blue-grey"
      text-color="white"
      v-if="event.venue"
    >
      <v-avatar left>
        <v-icon>mdi-home</v-icon>
      </v-avatar>
      {{ formatVenueName(event.venue) }}
    </v-chip>
    <v-chip
      class="mr-2 mb-2"
      color="blue-grey"
      text-color="white"
      v-if="event.start_date && event.end_date"
    >
      <v-avatar left>
        <v-icon>mdi-calendar</v-icon>
      </v-avatar>
      {{ event.start_date | moment("MMM D, YYYY") }} -
      {{ event.end_date | moment("MMM D, YYYY") }}
    </v-chip>
    <BasicEmailDialog
      :active="basicEmailDialog"
      :to="emailTo"
      @close="basicEmailDialog = false"
    ></BasicEmailDialog>
    <NotesDialog
      :active="notesDialog"
      :noteableId="event.id"
      noteableType="Event"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="event.id"
      tagableType="Event"
      @close="tagsDialog = false"
    ></TagsDialog>
    <PhotoDialog
      :active="photoDialog"
      :photographableId="event.id"
      :photoUrl="event.photo_url"
      uploadPhotoEndpoint="events/uploadPhoto"
      @close="photoDialog = false"
    ></PhotoDialog>
    <ContactDialog
      :active="contactDialog"
      :contactableId="event.id"
      :id="contactData.id"
      :name="contactData.name"
      :title="contactData.title"
      :email="contactData.email"
      :phone="contactData.phone"
      contactableType="Event"
      @close="contactDialog = false"
      :addMode="contactData.addMode"
    ></ContactDialog>
    <DeleteDialog
      :active="deleteDialog"
      :itemId="event.id"
      path="events/deleteEvent"
      @close="deleteDialog = false"
    />
    <ContactDeleteDialog
      :active="contactDeleteDialog"
      :itemId="contactData.id"
      path="contacts/deleteContact"
      @close="contactDeleteDialog = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import BasicEmailDialog from "@/components/EmailDialog/BasicEmailDialog";
import NotesDialog from "@/components/Note/NotesDialog";
import TagsDialog from "@/components/Tag/TagsDialog";
import PhotoDialog from "@/components/PhotoDialog";
import ContactDialog from "@/components/ContactDialog";
import ContactDeleteDialog from "@/components/DeleteDialog";
import DeleteDialog from "@/components/DeleteDialog";

export default {
  name: "EventHeader",
  components: {
    DeleteDialog,
    ContactDeleteDialog,
    BasicEmailDialog,
    NotesDialog,
    TagsDialog,
    PhotoDialog,
    ContactDialog,
  },
  props: {
    event: Object,
    viewOnly: Boolean,
    showEditIcon: {
      type: Boolean,
      default: false,
    },
    // metrics: Array,
  },

  data() {
    return {
      tagsDialog: false,
      deleteDialog: false,
      contactDeleteDialog: false,
      notesDialog: false,
      basicEmailDialog: false,
      dialog: false,
      valid: false,
      emailTo: null,
      photoDialog: false,
      contactDialog: false,
      contactData: {
        id: null,
        name: null,
        title: null,
        email: null,
        phone: null,
      },
      postData: {
        metricsPostData: [],
      },
      metricData: [],
    };
  },

  computed: {
    ...mapGetters({
      shift: "shifts/shift",
      metrics: "metrics/metrics",
      contacts: "contacts/contacts",
      metricValues: "metric_values/metric_values",
    }),
    awsUrl() {
      return process.env.VUE_APP_AWS_URL;
    },
  },

  methods: {
    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else
        return venue.name;
    },

    editChange() {
      this.viewOnly = !this.viewOnly;
      this.$emit("update", this.viewOnly);
    },

    showDeleteDialog(id) {
      this.contactData.id = id;
      this.deleteDialog = true;
    },

    showContactDialog(contact, addMode) {
      if (addMode) {
        this.contactData.addMode = false;
        this.contactData.name = null;
        this.contactData.title = null;
        this.contactData.email = null;
        this.contactData.phone = null;
        this.contactData.id = null;
        this.contactData.addMode = true;
      } else {
        this.contactData.name = contact.contact_master.name;
        this.contactData.title = contact.contact_master.title;
        this.contactData.email = contact.contact_master.email;
        this.contactData.phone = contact.contact_master.phone;
        this.contactData.id = contact.id;
        this.contactData.addMode = false;
      }
      this.contactDialog = true;
    },

    showDialog(email) {
      this.emailTo = email;
      this.basicEmailDialog = true;
    },

    updateMetrics() {
      let payload = {
        metrics: this.metricData,
      };

      if (this.$refs.form.validate()) {
        this.$store.dispatch("metric_values/updateMetricValues", payload);
        this.dialog = false;
      }
    },

    updateEvent() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("events/updateEvent", this.event);
        this.dialog = false;
      }
    },

    checkActive(item) {
      return moment().isBetween(
        moment(item.start_date, "YYYY-MM-DD"),
        moment(item.end_date, "YYYY-MM-DD"),
        "days",
        "[]"
      );
    },

    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }

      return null;
    },
  },

  watch: {
    event() {
      this.metricData = [];
      this.$store.dispatch(
        "metric_values/searchMetricValuesNoPaginate",
        "filter[metricable_id]=" +
          this.event.id +
          "&filter[metricable_type]=Event"
      );

      this.$store.dispatch(
        "contacts/searchContacts",
        "filter[contactable_type]=Event&filter[contactable_id]=" + this.event.id
      );
    },

    metrics() {
      //load all event metric fields to metricData array,
      for (let i = 0; i < this.metrics.length; i++) {
        if (
          !this.metricData.some(
            (item) => item.metric_id === this.metrics[i].id
          ) &&
          this.metrics[i].metric_type == "Event"
        ) {
          this.metricData.push({
            name: this.metrics[i].name,
            metric_id: this.metrics[i].id,
            metricable_id: this.$route.params.id,
            metricable_type: this.metrics[i].metric_type,
            value: 0,
          });
        }
      }
    },

    metricValues() {
      //load all event metric_values fields to metricData array
      for (let i = 0; i < this.metricValues.length; i++) {
        if (
          this.metricValues[i].metricable_type == "Event" &&
          this.metricValues[i].metric.active
        ) {
          this.metricData.push({
            name: this.metricValues[i].metric.name,
            metric_id: this.metricValues[i].metric_id,
            metricable_id: this.metricValues[i].metricable_id,
            metricable_type: this.metricValues[i].metricable_type,
            value: this.metricValues[i].value,
          });
        }
      }
    },
  },

  async mounted() {
    this.$store.dispatch(
      "contacts/searchContacts",
      "filter[contactable_type]=Event&filter[contactable_id]=" + this.event.id
    );

    await this.$store.dispatch(
      "metrics/searchMetricsNoPaginate",
      "filter[active]=1"
    );
    /*
    this.metricData = [];
    await this.$store.dispatch(
      "metric_values/searchMetricValuesNoPaginate",
      "filter[metricable_id]=" +
        this.event.id +
        "&filter[metricable_type]=Event"
    );
    */
  },
};
</script>

<style scoped>
.v-avatar {
  cursor: pointer;
}
</style>
