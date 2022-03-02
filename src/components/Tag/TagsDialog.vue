<template>
  <v-dialog v-model="activeStatus" max-width="700">
    <v-card>
      <v-toolbar flat class="grey lighten-4 mb-4">
        <v-toolbar-title>Tags</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon color="primary" @click="addMode = !addMode"
            ><v-icon>mdi-plus-circle-outline</v-icon></v-btn
          >
          <v-btn icon color="primary" @click="searchMode = !searchMode"
            ><v-icon>mdi-magnify</v-icon></v-btn
          >
          <v-btn icon color="primary" @click="activeStatus = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-row v-if="addMode">
          <v-col>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              v-on:submit.prevent="submit"
            >
              <v-text-field
                v-model="tagText"
                label="Enter new tag..."
                :rules="[(v) => !!v || 'required']"
                @keyup.enter="addTag"
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <v-data-iterator
              items-per-page="50"
              :items="tags.data"
              :page="page"
              :search="search"
              no-results-text=""
              no-data-text=""
              hide-default-footer
            >
              <template v-slot:header>
                <v-toolbar v-if="searchMode" flat class="mb-1 align-center">
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
                  >{{ tags.total }} Results</v-toolbar
                >
              </template>

              <template v-slot:default="props">
                <div
                  class="d-flex mb-8"
                  v-for="item in props.items"
                  :key="item.id"
                >
                  <div class="ml-4">
                    <div>{{ item.content }}</div>
                  </div>
                </div>
              </template>

              <template v-slot:footer>
                <div class="text-xs-center">
                  <v-pagination
                    v-model="page"
                    :length="tags.last_page"
                    :total-visible="15"
                  ></v-pagination>
                </div>
              </template>
            </v-data-iterator>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TagsDialog",
  props: {
    active: Boolean,
    tagableId: Number,
    tagableType: String,
  },
  data() {
    return {
      search: "",
      addMode: false,
      searchMode: false,
      page: 1,
      valid: false,
      tagText: "",
      formData: {
        user_id: 1,
        tagable_id: "",
        tagable_type: "",
        content: "",
      },
    };
  },

  computed: {
    ...mapGetters({
      tags: "tags/tags",
    }),

    activeStatus: {
      get() {
        /* eslint-disable */
        return this.active;
      },
      set() {
        this.$emit("close");
      },
    },
  },

  watch: {
    activeStatus() {
      if (this.activeStatus) {
        this.$store.dispatch(
          "tags/searchTags",
          "filter[tagable_type]=" +
            this.tagableType +
            "&filter[tagable_id]=" +
            this.tagableId
        );
      }
    },

    page(val, oldVal) {
      if (val != oldVal) {
        this.page = val;
        this.submit(false);
      }
    },
  },

  methods: {
    addTag() {
      if (this.$refs.form.validate()) {
        this.formData.tagable_id = this.tagableId;
        this.formData.tagable_type = this.tagableType;
        this.formData.content = this.tagText;
        this.$store.dispatch("tags/createTag", this.formData);
        this.tagText = "";
        this.addMode = false;
      }
    },

    exportCSV() {
      let ids = this.query.ids.join()
      if (ids) {
        window.location.href =
          process.env.VUE_APP_API_URL +
          "/tags-export?filter[id]=" + ids;
          this.$store.dispatch('global/resetObjects')
      } else {
        this.$store.dispatch('global/updateAlert', {visible: true, message: ["Please select item(s) to export"], type: "error"})
      }
    },

    submit(reset_pagination) {
      this.$store.dispatch("global/updateLoading", true, { root: true });

      let pageFilter = this.page != null ? "&page=" + this.page : "";

      if (reset_pagination) {
        pageFilter = "";
        this.page = 1;
      }

      let filter =
        "filter[tagable_type]=" +
        this.tagableType +
        "&filter[tagable_id]=" +
        this.tagableId +
        pageFilter;

      this.$store.dispatch("tags/searchTags", filter);
    },
  },

  mounted() {
    this.$store.dispatch(
      "tags/searchTags",
      "filter[tagable_type]=" +
        this.tagableType +
        "&filter[tagable_id]=" +
        this.tagableId
    );
  },
};
</script>

<style>
.tag-checkbox .v-messages {
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
