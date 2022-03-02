<template>
  <v-dialog v-model="activeStatus" max-width="700">
    <v-form ref="form" v-on:submit.prevent="submit">
      <v-card>
        <v-toolbar flat class="grey lighten-4 mb-4">
          <v-toolbar-title>Merge Objects</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon color="primary" @click="activeStatus = false"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                v-if="objectAction == 'volunteers/mergeVolunteer'"
                v-model="objectSource"
                :items="objectList"
                :item-text="(item) => `${item.first_name} ${item.last_name}`"
                item-value="id"
                label="Source Record"
                disabled
              ></v-autocomplete>
              <v-autocomplete
                v-else
                v-model="objectSource"
                :items="objectList"
                item-text="name"
                item-value="id"
                label="Source Record"
                disabled
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-if="objectAction == 'volunteers/mergeVolunteer'"
                v-model="formData.destination_id"
                :items="objectList"
                :item-text="(item) => `${item.first_name} ${item.last_name}`"
                item-value="id"
                label="Destination Record"
              ></v-autocomplete>
              <v-autocomplete
                v-else
                v-model="formData.destination_id"
                :items="objectList"
                item-text="name"
                item-value="id"
                label="Destination Record"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="formData.overwrite"
                label="Overwrite Data"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-btn
                class="white--text"
                color="green"
                depressed
                block
                @click="submit"
                >Merge</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "MergeDialog",
  props: {
    active: Boolean,
    objectSource: Object,
    objectAction: String,
    objectList: Array,
  },
  data() {
    return {
      formData: {
        source: null,
        destination_id: null,
        overwrite: false,
      },
    };
  },
  computed: {
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
  methods: {
    submit() {
      this.formData.id = this.objectSource.id;

      if (this.$refs.form.validate()) {
        this.$store.dispatch(this.objectAction, this.formData);
        this.activeStatus = false;
      }
    },
  },
  watch: {},

  mounted() {},
};
</script>
