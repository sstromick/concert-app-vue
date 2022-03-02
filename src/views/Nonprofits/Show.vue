<template>
  <v-container fluid v-if="nonprofit">
    <v-toolbar text flat class="grey lighten-4 mb-8">
      <v-avatar class="mr-2" @click="photoDialog = true">
        <v-img
          :src="awsUrl + '/nonprofits/' + nonprofit.photo_url"
          aspect-ratio="1"
          v-if="nonprofit.photo_url"
        ></v-img>
        <v-icon x-large v-else>mdi-camera</v-icon>
      </v-avatar>
      <v-toolbar-title>{{ nonprofit.name }}</v-toolbar-title>
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
      v-if="contacts.data && contacts.data.length"
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
              class="px-0 py-1 primary--text btn-tooltip"
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
              v-model="nonprofit.name"
              label="Name"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
            <v-text-field
              v-model="nonprofit.address_line_1"
              label="Address Line 1"
              :disabled="viewOnly"
            ></v-text-field>
            <v-text-field
              v-model="nonprofit.city"
              :disabled="viewOnly"
              label="City"
            ></v-text-field>
            <v-autocomplete
              v-model="nonprofit.state_id"
              :items="states"
              label="State"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :disabled="viewOnly"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="nonprofit.website"
              label="Website"
              :disabled="viewOnly"
            ></v-text-field>
            <v-text-field
              v-model="nonprofit.address_line_2"
              label="Address Line 2"
              :disabled="viewOnly"
            ></v-text-field>
            <v-text-field
              v-model="nonprofit.postal_code"
              label="Postal Code"
              :disabled="viewOnly"
            ></v-text-field>
            <v-autocomplete
              v-model="nonprofit.country_id"
              :items="countries"
              label="Country"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :disabled="viewOnly"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <Tabs :shifts="nonprofit.non_profit_shifts" />
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
      redirect="NonprofitsIndex"
      :itemId="nonprofit.id"
      path="nonprofits/deleteNonprofit"
      @close="deleteDialog = false"
    />
    <BasicEmailDialog
      :active="basicEmailDialog"
      :to="emailTo"
      @close="basicEmailDialog = false"
    ></BasicEmailDialog>
    <NotesDialog
      :active="notesDialog"
      :noteableId="nonprofit.id"
      noteableType="Nonprofit"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="nonprofit.id"
      tagableType="Nonprofit"
      @close="tagsDialog = false"
    ></TagsDialog>
    <PhotoDialog
      :active="photoDialog"
      :photographableId="nonprofit.id"
      :photoUrl="nonprofit.photo_url"
      uploadPhotoEndpoint="nonprofits/uploadPhoto"
      @close="photoDialog = false"
    ></PhotoDialog>
    <MergeDialog
      :active="mergeDialog"
      :objectSource="nonprofit"
      objectAction="nonprofits/mergeNonprofit"
      :objectList="nonprofits"
      @close="mergeDialog = false"
    ></MergeDialog>
    <ContactDialog
      :active="contactDialog"
      :contactableId="nonprofit.id"
      :id="contactData.id"
      :name="contactData.name"
      :title="contactData.title"
      :email="contactData.email"
      :phone="contactData.phone"
      contactableType="Nonprofit"
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
import Tabs from "@/components/NonProfit/Tabs";
import PhotoDialog from "@/components/PhotoDialog";
import MergeDialog from "@/components/MergeDialog";
import ContactDialog from "@/components/ContactDialog";
import ContactDeleteDialog from "@/components/DeleteDialog";

export default {
  name: "NonprofitShow",
  components: {
    DeleteDialog,
    BasicEmailDialog,
    ContactDeleteDialog,
    NotesDialog,
    TagsDialog,
    Tabs,
    PhotoDialog,
    MergeDialog,
    ContactDialog,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    basicEmailDialog: false,
    deleteDialog: false,
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
      nonprofit: "nonprofits/nonprofit",
      nonprofits: "nonprofits/nonprofits",
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
        this.$store.dispatch("nonprofits/updateNonprofit", this.nonprofit);
      }
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
    $route() {
      this.$store.dispatch("nonprofits/getNonprofit", this.$route.params.id);
      this.$store.dispatch("nonprofits/getNonprofitList");
      this.$store.dispatch(
        "contacts/searchContacts",
        "filter[contactable_type]=Nonprofit&filter[contactable_id]=" +
          this.$route.params.id
      );
    },
  },
  mounted() {
    this.$store.dispatch("nonprofits/getNonprofit", this.$route.params.id);
    this.$store.dispatch("nonprofits/getNonprofitList");
    this.$store.dispatch(
      "contacts/searchContacts",
      "filter[contactable_type]=Nonprofit&filter[contactable_id]=" +
        this.$route.params.id
    );
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
