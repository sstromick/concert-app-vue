<template>
  <v-container fluid>
    <v-toolbar flat class="grey lighten-4">
      <v-toolbar-title>New Contact</v-toolbar-title>
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
            <v-text-field v-model="formData.title" label="Title"></v-text-field>
            <v-text-field
              v-model="formData.email"
              label="Email"
              :rules="[(v) => /.+@.+/.test(v) || 'E-mail must be valid']"
            ></v-text-field>
            <v-text-field v-model="formData.phone" label="Phone"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.contactable_type"
              :items="contactableTypes"
              label="Contact Type"
              item-text="name"
              item-value="name"
            >
            </v-select>
            <v-autocomplete
              v-model="formData.contactable_id"
              :items="contactables"
              :label="'Choose ' + formData.contactable_type"
              item-text="name"
              item-value="id"
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
  name: "ContactNew",
  data: () => ({
    valid: false,
    contactables: [],
    contactableTypes: [
      { name: "Artist" },
      { name: "Event" },
      { name: "Nonprofit" },
      { name: "Venue" },
    ],
    formData: {
      name: "",
      venue_id: null,
      non_profit_id: null,
      title: "",
      email: "",
      phone: "",
      contactable_type: "",
      contactable_id: null,
    },
  }),
  computed: {
    ...mapGetters({
      artists: "artists/artists",
      events: "events/events",
      nonprofits: "nonprofits/nonprofits",
      venues: "venues/venues",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("contacts/createContact", this.formData);
        this.$router.push({ name: "ContactsIndex" });
      }
    },
    getContactables(target) {
      switch (target) {
        case "Artist":
          this.contactables = this.artists;
          break;
        case "Event":
          this.contactables = this.events;
          break;
        case "Nonprofit":
          this.contactables = this.nonprofits;
          break;
        case "Venue":
          this.contactables = this.venues;
          break;
      }
    },
  },
  mounted() {
    this.$store.dispatch("artists/getArtistList");
    this.$store.dispatch("events/getEventList");
    this.$store.dispatch("nonprofits/getNonprofitList");
    this.$store.dispatch("venues/getVenueList");
  },
  watch: {
    $route() {
      this.getContactables(this.formData.contactable_type);
    },
    "formData.contactable_type"(target) {
      this.getContactables(target);
    },
  },
};
</script>
