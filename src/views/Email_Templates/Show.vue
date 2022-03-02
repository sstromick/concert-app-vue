<template>
  <v-container fluid v-if="emailTemplate">
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>{{ emailTemplate.subject }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
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
              v-model="emailTemplate.event_id"
              :items="events.data"
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
              v-model="emailTemplate.shift_id"
              :items="shifts.data"
              label="Shift"
              item-text="item"
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
              v-model="emailTemplate.subject"
              label="Subject"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="emailTemplate.event_type"
              label="Event Type"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="emailTemplate.body"
              label="Body"
              :rules="[(v) => !!v || 'required']"
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
      redirect="EmailTemplates"
      :itemId="emailTemplate.id"
      path="email_templates/deleteEmailTemplate"
      @close="deleteDialog = false"
    />
    <NotesDialog
      :active="notesDialog"
      :noteableId="emailTemplate.id"
      noteableType="EmailTemplate"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="emailTemplate.id"
      tagableType="EmailTemplate"
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
  name: "EmailTemplateShow",
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
      emailTemplate: "email_templates/email_template",
      events: "events/events",
      shifts: "shifts/shifts",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch(
          "email_templates/updateEmailTemplate",
          this.emailTemplate
        );
      }
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("emails/getEmailTemplate", this.$route.params.id);
    },
  },
  mounted() {
    this.$store.dispatch(
      "email_templates/getEmailTemplate",
      this.$route.params.id
    );
    this.$store.dispatch("events/getEvents", this.$route.params.id);
    this.$store.dispatch("shifts/getShifts", this.$route.params.id);
  },
};
</script>
