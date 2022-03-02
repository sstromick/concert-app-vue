<template>
  <v-container fluid>
    <v-toolbar flat class="grey lighten-4">
      <v-toolbar-title>New Event</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text @click="$router.go(-1)" exact>Back</v-btn>
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
            <v-text-field
              v-model="formData.name"
              label="Name"
              :rules="[(v) => !!v || 'required']"
            ></v-text-field>
            <v-autocomplete
              v-model="formData.artist_id"
              :items="artists"
              label="Artist"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="formData.venue_id"
              :items="venues"
              label="Venue"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-menu
              v-model="menuStartDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="formData.start_date"
                  label="Start Date"
                  v-on="on"
                  :rules="[(v) => !!v || 'required']"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formData.start_date"
                @input="menuStartDate = false"
              ></v-date-picker>
            </v-menu>
            <v-menu
              v-model="menuEndDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="formData.end_date"
                  label="End Date"
                  v-on="on"
                  :rules="[(v) => !!v || 'required']"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formData.end_date"
                @input="menuEndDate = false"
              ></v-date-picker>
            </v-menu>
            <v-switch
              v-model="formData.passive"
              label="Passive"
              false-value
            ></v-switch>
            <v-switch
              v-model="formData.teams"
              label="Teams"
              false-value
            ></v-switch>
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
      @click="submit"
      v-if="valid == true"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "EventNew",
  data: () => ({
    valid: false,
    menuEndDate: null,
    menuStartDate: null,
    formData: {
      name: "",
      venu_id: "",
      artist_id: "",
      passive: false,
      teams: false,
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      CO2_artist_tonnes: "",
      CO2_fans_tonnes: "",
      start_date: "",
      end_date: "",
    },
  }),
  computed: {
    ...mapGetters({
      email: "events/event",
      artists: "artists/artists",
      venues: "venues/venues",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("events/createEvent", this.formData);
      }
    },
  },
  mounted() {
    this.$store.dispatch("venues/getVenueList", this.$route.params.id);
    this.$store.dispatch("artists/getArtistList", this.$route.params.id);
  },
};
</script>
