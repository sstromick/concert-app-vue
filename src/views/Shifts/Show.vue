<template>
  <v-flex v-if="shift && nonprofits && event">
    <div class="mb-4">
      <EventHeader :event="event" />
    </div>
    <ShiftHeader :shift="shift" :shifts="shifts" />
    <ShiftTabs
      v-if="!shift.event.teams"
      :shift="shift"
      :nonprofits="nonprofits"
    />
    <ShiftTeamTabs
      v-if="shift.event.teams"
      :shift="shift"
      :shifts="shifts"
      :nonprofits="nonprofits"
    />
  </v-flex>
</template>

<script>
import { mapGetters } from "vuex";
import EventHeader from "@/components/Event/EventHeader";
import ShiftHeader from "@/components/Shift/ShiftHeader";
import ShiftTabs from "@/components/Shift/ShiftTabs";
import ShiftTeamTabs from "@/components/Shift/ShiftTeamTabs";

export default {
  name: "ShiftShow",
  components: {
    EventHeader,
    ShiftHeader,
    ShiftTabs,
    ShiftTeamTabs,
  },
  data: () => ({}),

  computed: {
    ...mapGetters({
      event: "events/event",
      shift: "shifts/shift",
      shifts: "shifts/shifts",
      nonprofits: "nonprofits/nonprofits",
    }),
  },

  methods: {},

  watch: {
    shift() {
      this.$store.dispatch(
        "shifts/searchShiftsAll",
        "filter[event_id]=" + this.$route.params.id
      );
    },

    $route() {
      this.$store.dispatch("events/getEvent", this.$route.params.id);
      this.$store.dispatch("shifts/getShift", this.$route.params.shift_id);
      this.$store.dispatch(
        "shifts/searchShiftsAll",
        "filter[event_id]=" + this.$route.params.id
      );
      this.$store.dispatch("nonprofits/getNonprofitsNoPaginate");
    },
  },

  mounted() {
    this.$store.dispatch("events/getEvent", this.$route.params.id);
    this.$store.dispatch("shifts/getShift", this.$route.params.shift_id);
    this.$store.dispatch(
      "shifts/searchShiftsAll",
      "filter[event_id]=" + this.$route.params.id
    );
    this.$store.dispatch("nonprofits/getNonprofitsNoPaginate");
  },
};
</script>

<style scoped></style>
