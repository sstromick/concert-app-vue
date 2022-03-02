<template>
  <v-container fluid>
    <v-toolbar flat class="grey lighten-4">
      <v-toolbar-title>New Venue</v-toolbar-title>
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
              :rules="[(v) => !!v || 'required']"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="formData.address_1"
              label="Address Line 1"
            ></v-text-field>
            <v-text-field v-model="formData.city" label="City"></v-text-field>
            <v-text-field
              v-model="formData.postal_code"
              label="Postal Code"
            ></v-text-field>
            <v-text-field v-model="formData.phone" label="Phone"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="formData.time_zone"
              :items="timeZones"
              label="Time Zone"
              item-text="name"
              item-value="name"
              auto-select-first
              :allow-overflow="false"
            >
            </v-autocomplete>
            <v-text-field
              v-model="formData.address_2"
              label="Address Line 2"
            ></v-text-field>
            <v-autocomplete
              v-model="formData.state_id"
              :items="states"
              label="State"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :rules="[(v) => !!v || 'required']"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="formData.country_id"
              :items="countries"
              label="Country"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :rules="[(v) => !!v || 'required']"
            >
            </v-autocomplete>
            <v-text-field
              v-model="formData.website"
              label="Website"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-btn
      dark
      small
      fixed
      bottom
      right
      color="primary"
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
import moment from "moment";

export default {
  name: "VenueNew",
  data: () => ({
    valid: false,
    formData: {
      name: "",
      state_id: "",
      country_id: "",
      address_1: "",
      address_2: "",
      city: "",
      postal_code: "",
      country_text: "",
      state_text: "",
      website: "",
      phone: "",
      capacity: 0,
      compost: false,
      recycling_foh: false,
      recycling_single_stream_foh: false,
      recycling_sorted_foh: false,
      recycling_boh: false,
      recycling_single_stream_boh: false,
      recycling_sorted_boh: false,
      water_station: false,
      village_location: "",
      water_source: "",
      time_zone: "",
    },
  }),
  computed: {
    ...mapGetters({
      venues: "venues/venues",
      countries: "countries/countries",
      states: "states/states",
    }),

    timeZones() {
      if (this.formData.country_id) {
        let country = this.countries.find(
          (country) => country.id == this.formData.country_id
        );
        if (country) {
          if (country.name == "United States")
            return [
              "Eastern Time",
              "Central Time",
              "Mountain Time",
              "Pacific Time",
              "Alaska Time",
              "Hawaii Time",
            ];
          else return moment.tz.zonesForCountry(country.ISO2);
        } else {
          return moment.tz.names();
        }
      } else {
        return moment.tz.names();
      }
    },
  },

  watch: {
    countries() {
      let country = this.countries.find(
        (country) => country.name == "United States"
      );
      this.formData.country_id = country.id;
    },
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("venues/createVenue", this.formData);
      }
    },
  },
  mounted() {
    this.$store.dispatch("countries/getCountryList");
    this.$store.dispatch("states/getStateList");
  },
};
</script>
