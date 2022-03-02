<template>
  <v-container fluid>
    <v-toolbar flat class="grey lighten-4">
      <v-toolbar-title>New Volunteer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text color="primary" @click="$router.go(-1)" exact>Back</v-btn>
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
              v-model="formData.first_name"
              label="First Name"
            ></v-text-field>
            <v-text-field
              v-model="formData.address_line_1"
              label="Address Line 1"
            ></v-text-field>
            <v-text-field v-model="formData.city" label="City"></v-text-field>
            <v-autocomplete
              v-model="formData.state_id"
              :items="states"
              label="State"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
            >
            </v-autocomplete>
            <v-text-field v-model="formData.email" label="Email"></v-text-field>
            <v-autocomplete
              v-model="formData.gender"
              :items="genders"
              label="Gender"
              auto-select-first
              :allow-overflow="false"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.last_name"
              label="Last Name"
            ></v-text-field>
            <v-text-field
              v-model="formData.address_line_2"
              label="Address Line 2"
            ></v-text-field>
            <v-text-field
              v-model="formData.postal_code"
              label="Postal Code"
            ></v-text-field>
            <v-autocomplete
              v-model="formData.country_id"
              :items="countries"
              label="Country"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
            >
            </v-autocomplete>
            <v-text-field v-model="formData.phone" label="Phone"></v-text-field>
            <v-autocomplete
              v-model="formData.tshirt_size"
              :items="sizes"
              label="Tshirt Size"
              auto-select-first
              :allow-overflow="false"
            >
            </v-autocomplete>
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
  name: "VolunteerNew",
  data: () => ({
    valid: false,
    formData: {
      first_name: "",
      last_name: "",
      country_id: "",
      state_id: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      postal_code: "",
      email: "",
      phone: "",
      gender: "",
      tshirt_size: "",
    },
    genders: ["male", "female"],
    sizes: ["small", "medium", "large", "x-large", "xx-large"],
  }),
  computed: {
    ...mapGetters({
      volunteer: "volunteers/volunteer",
      countries: "countries/countries",
      states: "states/states",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("volunteers/createVolunteer", this.formData);
      }
    },
  },
  mounted() {
    this.$store.dispatch("countries/getCountryList");
    this.$store.dispatch("states/getStateList");
  },
};
</script>
