<template>
  <v-container fluid v-if="notes">
    <v-row>
      <v-col cols="12" class="mb-8">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          v-on:submit.prevent="submit"
        >
          <v-textarea
            solo
            autogrow
            clearable
            v-model="noteText"
            label="Add a new note..."
          ></v-textarea>
          <v-btn
            dark
            color="primary"
            class=""
            @click="addNote"
            v-if="valid == true"
          >
            Add Note
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-iterator
          items-per-page="50"
          :items="notes.data"
          :page="page"
          :search="search"
          no-results-text=""
          no-data-text=""
          hide-default-footer
        >
          <template v-slot:header>
            <v-toolbar flat class="mb-1 align-center">
              <v-text-field
                v-model="search"
                clearable
                light
                outlined
                solo
                flat
                hide-details
                append-inner-icon="mdi-magnify"
                label="Search"
              ></v-text-field>

              <v-spacer></v-spacer>
            </v-toolbar>
            <v-toolbar flat class="grey lighten-4 mt-8 mb-3"
              >{{ notes.total }} Results</v-toolbar
            >
          </template>

          <template v-slot:default="props">
            <div
              class="d-flex mb-8"
              v-for="item in props.items"
              :key="item.name"
            >
              <div class="ml-4">
                <div>{{ item.content }}</div>
                <div>
                  <small>
                    - {{ item.user.first_name }} {{ item.user.last_name }} on
                    {{ item.created_at | moment("dddd MMM D, YYYY") }}</small
                  >
                </div>
              </div>
            </div>
          </template>

          <template v-slot:footer>
            <div class="text-xs-center">
              <v-pagination
                v-model="page"
                :length="notes.last_page"
                :total-visible="15"
              ></v-pagination>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NotesIndex",

  data: () => ({
    valid: false,
    search: "",
    noteText: "",
    page: 1,
    formData: {
      user_id: 1,
      noteable_id: "",
      noteable_type: "",
      content: "",
    },
  }),

  computed: {
    ...mapGetters({
      notes: "notes/notes",
    }),

    noteableType() {
      //grab noteable object type from route path
      let noteable = this.$route.path.split("/")[1];
      let noteableType = noteable[0].toUpperCase() + noteable.slice(1);
      return noteableType;
    },
  },
  watch: {
    page(val, oldVal) {
      if (val != oldVal) {
        this.page = val;
        this.submit(false);
      }
    },
  },

  methods: {
    addNote() {
      if (this.$refs.form.validate()) {
        this.formData.noteable_id = this.$route.params.id;
        this.formData.noteable_type = this.noteableType;
        this.formData.content = this.noteText;
        this.$store.dispatch("notes/createNote", this.formData);
        this.noteText = "";
      }
    },

    exportCSV() {
      let ids = this.query.ids.join();
      if (ids) {
        window.location.href =
          process.env.VUE_APP_API_URL + "/notes-export?filter[id]=" + ids;
        this.$store.dispatch("global/resetObjects");
      } else {
        this.$store.dispatch("global/updateAlert", {
          visible: true,
          message: ["Please select item(s) to export"],
          type: "error",
        });
      }
    },

    submit(reset_pagination) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      let pageFilter = this.page != null ? "page=" + this.page : "";

      if (reset_pagination) {
        pageFilter = "";
        this.page = 1;
      }

      let filter = pageFilter;

      this.$store.dispatch("notes/searchNotes", filter);
    },
  },
  mounted() {
    this.$store.dispatch(
      "notes/searchNotes",
      "filter[noteable_type]=" + this.noteableType
    );
  },
};
</script>

<style>
.note-checkbox .v-messages {
  display: none !important;
}

.v-input--selection-controls {
  margin: 0;
  padding: 0;
  margin-top: auto;
  margin-bottom: auto;
}
.v-input__slot {
  margin-bottom: 0;
}
</style>
