<template>
  <v-container fluid v-if="email">
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>{{ email.subject }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text @click="$router.go(-1)" exact>Back</v-btn>
        <v-btn text @click="resendEmail()">Resend Email</v-btn>
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
            <v-autocomplete
              v-model="email.event_id"
              :items="events"
              label="Event"
              item-text="name"
              item-value="id"
              auto-select-first
              dense
              :allow-overflow="false"
              :disabled="viewOnly"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="email.email_template_id"
              :items="emailTemplates"
              label="Email Template"
              item-text="subject"
              item-value="id"
              auto-select-first
              dense
              :allow-overflow="false"
              :disabled="viewOnly"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="email.non_profit_shift_id"
              :items="nonprofitShifts"
              label="Non-profit Shift"
              item-text="contact_name"
              item-value="id"
              auto-select-first
              dense
              :allow-overflow="false"
              :disabled="viewOnly"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="email.volunteer_shift_id"
              :items="volunteerShifts"
              label="Volunteer Shift"
              item-text="volunteer_id"
              item-value="id"
              auto-select-first
              dense
              :allow-overflow="false"
              :disabled="viewOnly"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="email.email"
              label="Email"
              :rules="[(v) => /.+@.+/.test(v) || 'E-mail must be valid']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="email.subject"
              label="Subject"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="email.body"
              label="Body"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-switch
              v-model="email.delivered"
              :disabled="viewOnly"
              label="Delivered"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="email.error"
              :disabled="viewOnly"
              label="Error"
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
      redirect="Emails"
      :itemId="email.id"
      path="emails/deleteEmail"
      @close="deleteDialog = false"
    />
    <NotesDialog
      :active="notesDialog"
      :noteableId="email.id"
      noteableType="Email"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="email.id"
      tagableType="Email"
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
  name: "EmailShow",
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
      email: "emails/email",
      emailTemplates: "email_templates/email_templates",
      events: "events/events",
      nonprofitShifts: "nonprofit_shifts/nonprofit_shifts",
      volunteerShifts: "volunteer_shifts/volunteer_shifts",
    }),
  },
  methods: {
    resendEmail() {
      this.$store.dispatch("emails/sendEmails", {
        subject: this.email.subject,
        body: this.email.body,
        addresses: [{ email: this.email.email }],
      });
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("emails/updateEmail", this.email);
      }
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("emails/getEmail", this.$route.params.id);
    },
  },
  mounted() {
    this.$store.dispatch("emails/getEmail", this.$route.params.id);
    this.$store.dispatch("events/getEvents", this.$route.params.id);
    this.$store.dispatch(
      "email_templates/getEmailTemplates",
      this.$route.params.id
    );
    this.$store.dispatch(
      "nonprofit_shifts/getNonprofitShifts",
      this.$route.params.id
    );
    this.$store.dispatch(
      "volunteer_shifts/getVolunteerShifts",
      this.$route.params.id
    );
  },
};
</script>
