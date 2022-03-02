<template>
  <v-container fluid v-if="venue">
    <v-toolbar flat class="grey lighten-4 mb-4">
      <v-avatar class="mr-2" @click="photoDialog = true">
        <v-img
          :src="awsUrl + '/venues/' + venue.photo_url"
          aspect-ratio="1"
          v-if="venue.photo_url"
        ></v-img>
        <v-icon x-large v-else>mdi-camera</v-icon>
      </v-avatar>
      <v-toolbar-title>{{ venue.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text @click="$router.go(-1)" exact>Back</v-btn>
        <v-btn text @click="notesDialog = true">Notes</v-btn>
        <v-btn text @click="tagsDialog = true">Tags</v-btn>
        <v-btn text @click="photoDialog = true">Photo</v-btn>
        <v-btn text @click="mergeDialog = true">Merge</v-btn>
        <v-btn icon @click="viewOnly = !viewOnly"
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
              ><a @click="$router.go(-1)" href="#">Back</a></v-list-item-title
            >
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
            <v-list-item-title
              ><a @click="photoDialog = true" href="#"
                >Photo</a
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a @click="mergeDialog = true" href="#"
                >Merge</a
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a @click="deleteDialog = true" href="#"
                >Delete</a
              ></v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

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
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent="submit"
    >
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="venue.name"
              :rules="[(v) => !!v || 'required']"
              label="Name"
              required
              :disabled="viewOnly"
            ></v-text-field>
            <v-text-field
              v-model="venue.address_1"
              label="Address Line 1"
              :disabled="viewOnly"
            ></v-text-field>
            <v-text-field
              v-model="venue.city"
              :disabled="viewOnly"
              label="City"
            ></v-text-field>
            <v-text-field
              v-model="venue.postal_code"
              label="Postal Code"
              :disabled="viewOnly"
            ></v-text-field>
            <v-text-field
              v-model="venue.phone"
              :disabled="viewOnly"
              label="Phone"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="venue.time_zone"
              :items="timeZones(venue.country_id)"
              label="Time Zone"
              item-text="name"
              item-value="name"
              auto-select-first
              :allow-overflow="false"
              :disabled="viewOnly"
              clearable="true"
            >
            </v-autocomplete>
            <v-text-field
              v-model="venue.address_2"
              label="Address Line 2"
              :disabled="viewOnly"
            ></v-text-field>
            <v-autocomplete
              v-model="venue.state_id"
              :items="states"
              label="State"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="venue.country_id"
              :items="countries"
              label="Country"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            >
            </v-autocomplete>
            <v-text-field
              v-model="venue.website"
              label="Website"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <Tabs :shifts="venue.shifts" />
    <v-btn
      color="primary"
      dark
      small
      fixed
      bottom
      right
      fab
      v-if="valid == true && !viewOnly"
      @click="submit"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <ContactDeleteDialog
      :active="contactDeleteDialog"
      :itemId="contactData.id"
      path="contacts/deleteContact"
      @close="contactDeleteDialog = false"
    />
    <DeleteDialog
      :active="deleteDialog"
      redirect="VenuesIndex"
      :itemId="venue.id"
      path="venues/deleteVenue"
      @close="deleteDialog = false"
    />
    <BasicEmailDialog
      :active="basicEmailDialog"
      :to="emailTo"
      @close="basicEmailDialog = false"
    ></BasicEmailDialog>
    <NotesDialog
      :active="notesDialog"
      :noteableId="venue.id"
      noteableType="Venue"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="venue.id"
      tagableType="Venue"
      @close="tagsDialog = false"
    ></TagsDialog>
    <PhotoDialog
      :active="photoDialog"
      :photographableId="venue.id"
      :photoUrl="venue.photo_url"
      uploadPhotoEndpoint="venues/uploadPhoto"
      @close="photoDialog = false"
    ></PhotoDialog>
    <MergeDialog
      :active="mergeDialog"
      :objectSource="venue"
      objectAction="venues/mergeVenue"
      :objectList="venues"
      @close="mergeDialog = false"
    ></MergeDialog>
    <ContactDialog
      :active="contactDialog"
      :contactableId="venue.id"
      :id="contactData.id"
      :name="contactData.name"
      :title="contactData.title"
      :email="contactData.email"
      :phone="contactData.phone"
      contactableType="Venue"
      @close="contactDialog = false"
      :addMode="contactData.addMode"
    ></ContactDialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import BasicEmailDialog from "@/components/EmailDialog/BasicEmailDialog";
import DeleteDialog from "@/components/DeleteDialog";
import NotesDialog from "@/components/Note/NotesDialog";
import TagsDialog from "@/components/Tag/TagsDialog";
import PhotoDialog from "@/components/PhotoDialog";
import MergeDialog from "@/components/MergeDialog";
import ContactDialog from "@/components/ContactDialog";
import ContactDeleteDialog from "@/components/DeleteDialog";
import Tabs from "@/components/Venue/Tabs";
import moment from "moment";

export default {
  name: "VenueShow",
  components: {
    DeleteDialog,
    BasicEmailDialog,
    NotesDialog,
    TagsDialog,
    PhotoDialog,
    MergeDialog,
    ContactDialog,
    ContactDeleteDialog,
    Tabs,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    deleteDialog: false,
    basicEmailDialog: false,
    contactDeleteDialog: false,
    emailTo: null,
    notesDialog: false,
    tagsDialog: false,
    photoDialog: false,
    mergeDialog: false,
    contactDialog: false,
    contactData: {
      id: null,
      name: null,
      title: null,
      email: null,
      phone: null,
    },
  }),
  computed: {
    ...mapGetters({
      venue: "venues/venue",
      venues: "venues/venues",
      countries: "countries/countries",
      states: "states/states",
      contacts: "contacts/contacts",
    }),
    awsUrl() {
      return process.env.VUE_APP_AWS_URL;
    },
  },
  methods: {
    showDeleteDialog(id) {
      this.contactData.id = id;
      this.contactDeleteDialog = true;
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

    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("venues/updateVenue", this.venue);
      }
    },
    timeZones(country_id) {
      if (country_id) {
        let country = this.countries.find(
          (country) => country.id == country_id
        );
        if (country) {
          if (country.name == "United States")
            return [
              "Eastern Time",
              "Central Time",
              "Mountain Time",
              "Pacific Time",
              "Alaska Time",
              "Hawaii Time",
            ];
          else return moment.tz.zonesForCountry(country.ISO2);
        } else {
          return moment.tz.names();
        }
      } else {
        return moment.tz.names();
      }
    },
    eventTitle(item) {
      const separator = " - ";
      let eventTitle = "";
      let artistName = item.artist ? item.artist.name : null;
      let venueName = this.venue.name;
      let eventName = item.name;
      if (artistName) eventTitle += artistName;
      if (venueName)
        eventTitle += eventTitle ? separator + venueName : venueName;
      if (eventName)
        eventTitle += eventTitle ? separator + eventName : eventName;

      return eventTitle;
    },
    showDialog(email) {
      this.emailTo = email;
      this.basicEmailDialog = true;
    },
    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }

      return null;
    },
    checkActive(item) {
      return moment().isBefore(moment(item.end_date, "YYYY-MM-DD"), "days");
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("venues/getVenue", this.$route.params.id);
      this.$store.dispatch("venues/getVenueList");
      this.$store.dispatch(
        "contacts/searchContacts",
        "filter[contactable_type]=Venue&filter[contactable_id]=" +
          this.$route.params.id
      );
    },
  },
  mounted() {
    this.$store.dispatch("venues/getVenue", this.$route.params.id);
    this.$store.dispatch(
      "contacts/searchContacts",
      "filter[contactable_type]=Venue&filter[contactable_id]=" +
        this.$route.params.id
    );
    this.$store.dispatch("venues/getVenueList");
    this.$store.dispatch("countries/getCountries", this.$route.params.id);
    this.$store.dispatch("states/getStates", this.$route.params.id);
  },
};
</script>

<style scoped>
.v-avatar {
  cursor: pointer;
}
</style>
