<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="shiftsListVisible">
        <div class="list-header list-header--shifts">
          <h4>Upcoming Shifts</h4>
        </div>
        <div v-for="item in getUpcomingShifts(shifts)" :key="item.id">
          <v-toolbar flat class="search-result" style="margin-bottom: 10px">
            <v-toolbar-title class="flex-grow-1">
              <router-link
                :to="{
                  name: 'ShiftShow',
                  params: { id: item.event_id, shift_id: item.id },
                }"
                class="flex flex-grow-1"
              >
                <strong>{{ shiftTitle(item) }}</strong>
              </router-link>
              <div
                v-if="item.shift_schedules.length"
                class="mt-2 d-flex flex-wrap"
              >
                <v-menu
                  :open-on-hover="true"
                  :offset-y="true"
                  class="tooltip-menu"
                  max-width="99%"
                >
                  <template v-slot:activator="{ on }">
                    <v-chip
                      class="mr-2 mb-2"
                      color="blue-grey"
                      text-color="white"
                      v-on="on"
                    >
                      <v-avatar left>
                        <v-icon>mdi-alarm</v-icon>
                      </v-avatar>
                      <strong class="pr-1">Schedule</strong>
                    </v-chip>
                  </template>
                  <div class="tooltip">
                    <span v-if="item.shift_schedules.length">
                      <ul class="schedule-items-list">
                        <li
                          v-for="scheduleItem in item.shift_schedules"
                          :key="scheduleItem.id"
                        >
                          <strong>{{
                            scheduleItem.start_date | moment("dddd MMM D, YYYY")
                          }}</strong
                          ><br />Doors: {{ scheduleItem.doors }} | Check:
                          {{ scheduleItem.check_in }}
                        </li>
                      </ul>
                    </span>
                  </div>
                </v-menu>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.venue"
                >
                  <v-avatar left>
                    <v-icon>mdi-home</v-icon>
                  </v-avatar>
                  {{ formatVenueName(item.venue) }}
                </v-chip>
              </div>
              <div v-else class="mt-2 d-flex flex-wrap">
                <template>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                  >
                    <v-avatar left>
                      <v-icon>mdi-alarm</v-icon>
                    </v-avatar>
                    <strong class="pr-1">Doors:</strong>
                    {{ item.doors }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                  >
                    <v-avatar left>
                      <v-icon>mdi-alarm</v-icon>
                    </v-avatar>
                    <strong class="pr-1">Check-In:</strong>
                    {{ item.check_in }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.venue"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ formatVenueName(item.venue) }}
                  </v-chip>
                </template>
              </div>
            </v-toolbar-title>
          </v-toolbar>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="shiftsListVisible">
        <div class="list-header list-header--shifts">
          <h4>Past Shifts</h4>
        </div>
        <div v-for="item in getPastShifts(shifts)" :key="item.id">
          <v-toolbar flat class="search-result" style="margin-bottom: 10px">
            <v-toolbar-title class="flex-grow-1">
              <router-link
                :to="{
                  name: 'ShiftShow',
                  params: { id: item.event_id, shift_id: item.id },
                }"
                class="flex flex-grow-1"
              >
                <strong>{{ shiftTitle(item) }}</strong>
              </router-link>
              <div
                v-if="item.shift_schedules.length"
                class="mt-2 d-flex flex-wrap"
              >
                <v-menu
                  :open-on-hover="true"
                  :offset-y="true"
                  class="tooltip-menu"
                  max-width="99%"
                >
                  <template v-slot:activator="{ on }">
                    <v-chip
                      class="mr-2 mb-2"
                      color="blue-grey"
                      text-color="white"
                      v-on="on"
                    >
                      <v-avatar left>
                        <v-icon>mdi-alarm</v-icon>
                      </v-avatar>
                      <strong class="pr-1">Schedule</strong>
                    </v-chip>
                  </template>
                  <div class="tooltip">
                    <span v-if="item.shift_schedules.length">
                      <ul class="schedule-items-list">
                        <li
                          v-for="scheduleItem in item.shift_schedules"
                          :key="scheduleItem.id"
                        >
                          <strong>{{
                            scheduleItem.start_date | moment("dddd MMM D, YYYY")
                          }}</strong
                          ><br />Doors: {{ scheduleItem.doors }} | Check:
                          {{ scheduleItem.check_in }}
                        </li>
                      </ul>
                    </span>
                  </div>
                </v-menu>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.venue"
                >
                  <v-avatar left>
                    <v-icon>mdi-home</v-icon>
                  </v-avatar>
                  {{ formatVenueName(item.venue) }}
                </v-chip>
              </div>
              <div v-else class="mt-2 d-flex flex-wrap">
                <template>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                  >
                    <v-avatar left>
                      <v-icon>mdi-alarm</v-icon>
                    </v-avatar>
                    <strong class="pr-1">Doors:</strong>
                    {{ item.doors }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                  >
                    <v-avatar left>
                      <v-icon>mdi-alarm</v-icon>
                    </v-avatar>
                    <strong class="pr-1">Check-In:</strong>
                    {{ item.check_in }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.venue"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ formatVenueName(item.venue) }}
                  </v-chip>
                </template>
              </div>
            </v-toolbar-title>
          </v-toolbar>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  name: "Tabs",

  props: {
    contacts: Array,
    shifts: Array,
  },

  data() {
    return {
      contactsListVisible: true,
      shiftsListVisible: true,
    };
  },

  methods: {
    getUpcomingShifts(shifts) {
      return shifts.filter(
        (shift) =>
          shift && shift.end_date >= moment().format('YYYY-MM-DD')
      );
    },

    getPastShifts(shifts) {
      return shifts.filter(
        (shift) =>
          shift && shift.end_date < moment().format('YYYY-MM-DD')
      );
    },

    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else
        return venue.name;
    },

    shiftTitle(item) {
      let hasArtist = false;
      const separator = " - ";
      let shiftTitle = "";
      let artistName = item.artist ? item.artist.name : null;

      let eventArtistName = null;
      let eventName = null;
      if (item.event) {
        eventArtistName = item.event.artist ? item.event.artist.name : null;
        eventName = item.event.name;
      }
      let start = moment(item.start_date, "YYYY-MM-DD").format(
        "dddd MMM D, YYYY"
      );

      if (artistName) {
        shiftTitle += artistName;
        hasArtist = true;
      } else if (eventArtistName) {
        shiftTitle += eventArtistName;
        hasArtist = true;
      }

      if (eventName)
        if (hasArtist) shiftTitle += separator + eventName;
        else shiftTitle += eventName;

      if (start) shiftTitle += separator + start;

      return shiftTitle;
    },

    togleContactsTab: function() {
      this.contactsListVisible = !this.contactsListVisible;
    },
    togleShiftsTab: function() {
      this.shiftsListVisible = !this.shiftsListVisible;
    },
  },
};
</script>

<style scoped>
.tab {
  height: 95px !important;
  display: flex;
  align-items: center;
}
.tab-contacts {
  background-color: #dc3036;
  border: 1px solid #dc3036 !important;
}
.tab-shifts {
  background-color: #2196f3;
  border: 1px solid #2196f3 !important;
}
.tab-active .card-text {
  color: #fff !important;
}
.tab-not-active {
  background-color: transparent;
}
.card-text {
  font-size: 1.2rem;
}
.list-header {
  padding: 1rem;
  margin-bottom: 1rem;
  color: #fff;
  font-weight: 700;
}
.list-header--contacts {
  background: #dc3036;
}
.list-header--shifts {
  background: #2196f3;
}
</style>
