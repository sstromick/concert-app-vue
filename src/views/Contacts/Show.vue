<template>
  <v-container fluid v-if="contactMaster">
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>{{ contactMaster.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text @click="$router.go(-1)" exact>Back</v-btn>
        <v-btn text @click="notesDialog = true">Notes</v-btn>
        <v-btn text @click="tagsDialog = true">Tags</v-btn>
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
              ><a @click="deleteDialog = true" href="#"
                >Delete</a
              ></v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
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
            <v-text-field
              v-model="contactMaster.name"
              label="Name"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="contactMaster.title"
              label="Title"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="contactMaster.email"
              label="Email"
              :rules="[(v) => /.+@.+/.test(v) || 'E-mail must be valid']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="contactMaster.phone"
              label="Phone"
              :disabled="viewOnly"
            ></v-text-field>
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
      v-if="valid == true && !viewOnly"
      @click="submit"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <DeleteDialog
      :active="deleteDialog"
      redirect="Contacts"
      :itemId="contactMaster.id"
      path="contacts/deleteContact"
      @close="deleteDialog = false"
    />
    <NotesDialog
      :active="notesDialog"
      :noteableId="contactMaster.id"
      noteableType="ContactMaster"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="contactMaster.id"
      tagableType="ContactMaster"
      @close="tagsDialog = false"
    ></TagsDialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DeleteDialog from "@/components/DeleteDialog";
import NotesDialog from "@/components/Note/NotesDialog";
import TagsDialog from "@/components/Tag/TagsDialog";
export default {
  name: "ContactShow",
  components: {
    DeleteDialog,
    NotesDialog,
    TagsDialog,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    deleteDialog: false,
    notesDialog: false,
    tagsDialog: false,
  }),
  computed: {
    ...mapGetters({
      contactMaster: "contact_masters/contact_master",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch(
          "contact_masters/updateContactMaster",
          this.contactMaster
        );
      }
    },
    /*
    getContactables(target) {
      switch (target) {
        case "App\\Models\\Artist":
          this.contactables = this.artists;
          break;
        case "App\\Models\\Event":
          this.contactables = this.events;
          break;
        case "App\\Models\\Nonprofit":
          this.contactables = this.nonprofits;
          break;
        case "App\\Models\\Venue":
          this.contactables = this.venues;
          break;
      }
    },
    */
  },
  watch: {
    $route() {
      this.$store.dispatch(
        "contact_masters/getContactMaster",
        this.$route.params.id
      );
    },
    /*
    "contact.contactable_type"(target, oldTarget) {
      if (oldTarget) {
        this.contact.contactable_id = null;
      }
      this.getContactables(target);
    },
    */
  },
  created() {
    /*
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("events/getEventList");
    this.$store.dispatch("nonprofits/getNonprofitList");
    this.$store.dispatch("venues/getVenueList");
    */
  },
  mounted() {
    this.$store.dispatch(
      "contact_masters/getContactMaster",
      this.$route.params.id
    );
    /*
    this.$store.dispatch(
      "contacts/searchContacts",
      "filter[contact_master_id]=" + this.$route.params.id
    );
    */
  },
};
</script>
