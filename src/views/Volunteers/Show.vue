<template>
  <v-container fluid v-if="volunteer">
    <v-toolbar flat class="grey lighten-4 mb-4">
      <v-avatar class="mr-2" @click="photoDialog = true">
        <v-img
          :src="awsUrl + '/volunteers/' + volunteer.photo_url"
          aspect-ratio="1"
          v-if="volunteer.photo_url"
        ></v-img>
        <v-icon x-large v-else>mdi-camera</v-icon>
      </v-avatar>
      <v-toolbar-title class="capitalize"
        >{{ volunteer.first_name }} {{ volunteer.last_name }}
      </v-toolbar-title>
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
        <v-btn
          :color="volunteer.blocked ? 'green' : 'red'"
          text
          @click="blockUnblockVolunteer(!volunteer.blocked)"
          >{{ volunteer.blocked ? "Unblock" : "Block" }}</v-btn
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
          <v-list-item>
            <v-list-item-title
              ><a
                :class="volunteer.blocked ? 'green--text' : 'red--text'"
                @click="blockUnblockVolunteer(!volunteer.blocked)"
                href="#"
                >{{ volunteer.blocked ? "Unblock" : "Block" }}</a
              ></v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-chip
      class="mb-4"
      color="blue-grey"
      text-color="white"
      v-if="volunteer.created_at"
    >
      <v-avatar left>
        <v-icon>mdi-calendar-clock</v-icon>
      </v-avatar>
      Volunteer Since: {{ volunteer.created_at | moment("MMM D, YYYY") }}
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
              v-model="volunteer.first_name"
              label="First Name"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="volunteer.last_name"
              label="Last Name"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              :disabled="viewOnly"
              v-model="volunteer.country_id"
              :items="countries"
              label="Country"
              item-text="name"
              item-value="id"
              auto-select-first
              dense
              :allow-overflow="false"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              :disabled="viewOnly"
              v-model="volunteer.state_id"
              :items="states"
              label="State"
              item-text="name"
              item-value="id"
              auto-select-first
              dense
              :allow-overflow="false"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :disabled="viewOnly"
              v-model="volunteer.address_line_1"
              label="Address Line 1"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :disabled="viewOnly"
              v-model="volunteer.address_line_2"
              label="Address Line 2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :disabled="viewOnly"
              v-model="volunteer.city"
              label="City"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :disabled="viewOnly"
              v-model="volunteer.postal_code"
              label="Postal Code"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :disabled="viewOnly"
              v-model="volunteer.email"
              label="Email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :disabled="viewOnly"
              v-model="volunteer.phone"
              label="Phone"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              :disabled="viewOnly"
              v-model="volunteer.gender"
              :items="genders"
              label="Gender"
              auto-select-first
              dense
              :allow-overflow="false"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              :disabled="viewOnly"
              v-model="volunteer.tshirt_size"
              :items="sizes"
              label="Tshirt Size"
              auto-select-first
              dense
              :allow-overflow="false"
            >
            </v-autocomplete>
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
      redirect="VolunteersIndex"
      :itemId="volunteer.id"
      path="volunteers/deleteVolunteer"
      @close="deleteDialog = false"
    />
    <Tabs
      :volunteer_shifts="volunteer.volunteer_shifts"
      :emails="volunteer.emails"
      :notes="volunteer.notes"
    />
    <NotesDialog
      :active="notesDialog"
      :noteableId="volunteer.id"
      noteableType="Volunteer"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="volunteer.id"
      tagableType="Volunteer"
      @close="tagsDialog = false"
    ></TagsDialog>
    <PhotoDialog
      :active="photoDialog"
      :photographableId="volunteer.id"
      :photoUrl="volunteer.photo_url"
      uploadPhotoEndpoint="volunteers/uploadPhoto"
      @close="photoDialog = false"
    ></PhotoDialog>
    <MergeDialog
      :active="mergeDialog"
      :objectSource="volunteer"
      objectAction="volunteers/mergeVolunteer"
      :objectList="volunteers"
      @close="mergeDialog = false"
    ></MergeDialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import DeleteDialog from "@/components/DeleteDialog";
import NotesDialog from "@/components/Note/NotesDialog";
import TagsDialog from "@/components/Tag/TagsDialog";
import Tabs from "@/components/Volunteer/Tabs";
import PhotoDialog from "@/components/PhotoDialog";
import MergeDialog from "@/components/MergeDialog";

export default {
  name: "VolunteerShow",
  components: {
    DeleteDialog,
    NotesDialog,
    TagsDialog,
    Tabs,
    PhotoDialog,
    MergeDialog,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    deleteDialog: false,
    genders: ["male", "female"],
    sizes: ["small", "medium", "large", "x-large", "xx-large"],
    notesDialog: false,
    tagsDialog: false,
    photoDialog: false,
    mergeDialog: false,
  }),
  computed: {
    ...mapGetters({
      volunteer: "volunteers/volunteer",
      volunteers: "volunteers/volunteers",
      countries: "countries/countries",
      states: "states/states",
    }),
    awsUrl() {
      return process.env.VUE_APP_AWS_URL;
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("volunteers/updateVolunteer", this.volunteer);
      }
    },
    convertTime(input) {
      return moment(input, "HH:mm:ss").format("h:mm A");
    },
    blockUnblockVolunteer(status) {
      this.$store.dispatch("volunteers/updateVolunteer", {
        id: this.$route.params.id,
        blocked: status,
      });
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("volunteers/getVolunteer", this.$route.params.id);
      this.$store.dispatch(
        "volunteer_shifts/searchVolunteerShifts",
        "filter[volunteer_id]=" + this.$route.params.id
      );
      this.$store.dispatch("volunteers/getVolunteerList");
    },
  },
  mounted() {
    this.$store.dispatch("volunteers/getVolunteer", this.$route.params.id);
    this.$store.dispatch("volunteers/getVolunteerList");
    this.$store.dispatch(
      "volunteer_shifts/getVolunteerShiftsByVolunteer",
      "volunteer-id=" + this.$route.params.id
    );
    this.$store.dispatch("countries/getCountries", this.$route.params.id);
    this.$store.dispatch("states/getStates", this.$route.params.id);
  },
};
</script>
<style scoped>
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
.v-avatar {
  cursor: pointer;
}
</style>
