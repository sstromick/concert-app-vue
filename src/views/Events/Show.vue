<template>
  <v-container fluid v-if="event">
    <EventHeader
      :event="event"
      :viewOnly="viewOnly"
      @update="viewOnlyChanged"
      showEditIcon="true"
    />
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
              v-model="event.name"
              label="Name"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
            <v-autocomplete
              v-model="event.artist_id"
              :items="artists"
              label="Artist"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :disabled="viewOnly"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="event.venue_id"
              :items="venues"
              label="Venue"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :disabled="viewOnly"
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
                  v-model="event.start_date"
                  label="Start Date"
                  v-on="on"
                  :rules="[(v) => !!v || 'required']"
                  :disabled="viewOnly"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="event.start_date"
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
                  v-model="event.end_date"
                  label="End Date"
                  v-on="on"
                  :rules="[(v) => !!v || 'required']"
                  :disabled="viewOnly"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="event.end_date"
                @input="menuEndDate = false"
                :disabled="viewOnly"
              ></v-date-picker>
            </v-menu>
            <v-switch
              v-model="event.teams"
              :disabled="viewOnly"
              label="Teams"
            ></v-switch>
            <v-switch
              v-model="event.passive"
              :disabled="viewOnly"
              label="Passive"
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
      v-if="valid == true && !viewOnly"
      @click="submit"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <DeleteDialog
      :active="deleteDialog"
      redirect="Events"
      :itemId="event.id"
      path="events/deleteEvent"
      @close="deleteDialog = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DeleteDialog from "@/components/DeleteDialog";
import EventHeader from "@/components/Event/EventHeader";

export default {
  name: "EventShow",
  components: {
    DeleteDialog,
    EventHeader,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    deleteDialog: false,
    menuEndDate: null,
    menuStartDate: null,
  }),
  computed: {
    ...mapGetters({
      event: "events/event",
      artists: "artists/artists",
      venues: "venues/venues",
    }),
  },
  methods: {
    viewOnlyChanged(value) {
      this.viewOnly = value;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("events/updateEvent", this.event);
      }
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("events/getEvent", this.$route.params.id);
    },
  },
  mounted() {
    this.$store.dispatch("events/getEvent", this.$route.params.id);
    this.$store.dispatch("artists/getArtistList", this.$route.params.id);
    this.$store.dispatch("venues/getVenueList", this.$route.params.id);
  },
};
</script>
