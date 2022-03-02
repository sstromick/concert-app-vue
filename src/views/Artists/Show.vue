<template>
  <v-container fluid v-if="artist">
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-avatar class="mr-2" @click="photoDialog = true">
        <v-img
          :src="awsUrl + '/artists/' + artist.photo_url"
          aspect-ratio="1"
          v-if="artist.photo_url"
        ></v-img>
        <v-icon x-large v-else>mdi-camera</v-icon>
      </v-avatar>
      <v-toolbar-title>{{ artist.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text @click="$router.go(-1)" exact>Back</v-btn>
        <v-btn text @click="notesDialog = true">Notes</v-btn>
        <v-btn text @click="tagsDialog = true">Tags</v-btn>
        <v-btn text @click="photoDialog = true">Photo</v-btn>
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
              v-model="artist.name"
              label="Name"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-container fluid v-if="artist.events.length > 0">
      <h2>Events</h2>
      <v-row>
        <v-col cols="12">
          <v-data-iterator
            :items="artist.events"
            no-results-text=""
            no-data-text=""
            hide-default-footer
          >
            <template v-slot:default="props">
              <v-toolbar
                flat
                class="search-result"
                v-for="item in props.items"
                :key="item.id"
              >
                <v-toolbar-title>
                  <router-link
                    :to="{ name: 'EventShifts', params: { id: item.id } }"
                    class="flex flex-grow-1"
                  >
                    <strong>{{ eventTitle(item) }}</strong>
                  </router-link>
                  <div class="mt-2 d-flex flex-wrap">
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
                      color="green"
                      text-color="white"
                      v-if="checkActive(item)"
                      >Active</v-chip
                    >
                    <v-chip text-color="green" v-if="!checkActive(item)"
                      >Inactive</v-chip
                    >
                  </div>
                </div>
              </v-toolbar>
            </template>
          </v-data-iterator>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      color="green"
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
      redirect="ArtistsIndex"
      :itemId="artist.id"
      path="artists/deleteArtist"
      @close="deleteDialog = false"
    />
    <BasicEmailDialog
      :active="basicEmailDialog"
      :to="emailTo"
      @close="basicEmailDialog = false"
    ></BasicEmailDialog>
    <NotesDialog
      :active="notesDialog"
      :noteableId="artist.id"
      noteableType="Artist"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="artist.id"
      tagableType="Artist"
      @close="tagsDialog = false"
    ></TagsDialog>
    <PhotoDialog
      :active="photoDialog"
      :photographableId="artist.id"
      :photoUrl="artist.photo_url"
      uploadPhotoEndpoint="artists/uploadPhoto"
      @close="photoDialog = false"
    ></PhotoDialog>
    <ContactDialog
      :active="contactDialog"
      :contactableId="artist.id"
      :id="contactData.id"
      :name="contactData.name"
      :title="contactData.title"
      :email="contactData.email"
      :phone="contactData.phone"
      contactableType="Artist"
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
import ContactDialog from "@/components/ContactDialog";
import ContactDeleteDialog from "@/components/DeleteDialog";
import moment from "moment";

export default {
  name: "ArtistShow",
  components: {
    DeleteDialog,
    BasicEmailDialog,
    ContactDeleteDialog,
    NotesDialog,
    TagsDialog,
    PhotoDialog,
    ContactDialog,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    deleteDialog: false,
    basicEmailDialog: false,
    contactDeleteDialog: false,
    notesDialog: false,
    tagsDialog: false,
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
  }),
  computed: {
    ...mapGetters({
      artist: "artists/artist",
      contacts: "contacts/contacts",
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
        this.$store.dispatch("artists/updateArtist", this.artist);
      }
    },
    eventTitle(item) {
      const separator = " - ";
      let eventTitle = "";
      let artistName = this.artist.name;
      let venueName = item.venue ? item.venue.name : null;
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
      this.$store.dispatch("artists/getArtist", this.$route.params.id);
      this.$store.dispatch(
        "contacts/searchContacts",
        "filter[contactable_type]=Artist&filter[contactable_id]=" +
          this.$route.params.id
      );
    },
  },
  mounted() {
    this.$store.dispatch("artists/getArtist", this.$route.params.id);
    this.$store.dispatch(
      "contacts/searchContacts",
      "filter[contactable_type]=Artist&filter[contactable_id]=" +
        this.$route.params.id
    );
  },
};
</script>

<style scoped>
.v-avatar {
  cursor: pointer;
}
</style>
