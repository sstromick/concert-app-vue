<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6">
        <div class="list-header list-header--emails">
          <h4>Emails</h4>
        </div>
        <div v-if="emailListVisible">
          <div v-for="item in emails" :key="item.id">
            <v-toolbar flat class="search-result" style="margin-bottom: 10px">
              <v-toolbar-title class="flex-grow-1">
                <router-link
                  :to="{ name: 'EmailShow', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong>{{ item.email }}</strong>
                </router-link>
                <div class="subtitle">{{ item.subject }}</div>
              </v-toolbar-title>
            </v-toolbar>
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="6">
        <div class="list-header list-header--shifts">
          <h4>Upcoming Shifts</h4>
        </div>
        <div v-if="shiftsListVisible" class="mb-12">
          <v-toolbar
            flat
            class="search-result"
            style="margin-bottom: 20px"
            v-for="item in getUpcomingShifts(volunteer_shifts)"
            :key="item.id"
          >
            <v-toolbar-title class="flex-grow-1">
              <router-link
                :to="{
                  name: 'ShiftShow',
                  params: { id: item.shift.event_id, shift_id: item.shift.id },
                }"
                class="flex flex-grow-1"
              >
                <strong v-if="item.shift.name">{{ item.shift.name }}</strong>
                <strong v-else>
                  {{
                    item.shift.start_date | moment("dddd MMM D, YYYY")
                  }}</strong
                >
                <strong v-if="item.shift.event">
                  - {{ item.shift.event.name }}</strong
                >
                <strong
                  v-if="item.shift.venue.state_text && item.shift.venue.city"
                >
                  - {{ item.shift.venue.city }},
                  {{ item.shift.venue.state_text }}
                </strong>
              </router-link>
              <div v-if="item.shift.event.teams" class="mt-2 d-flex flex-wrap">
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
                    <span v-if="item.shift.event.teams">
                      <ul class="schedule-items-list">
                        <li
                          v-for="scheduleItem in item.shift.shift_schedules"
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
                  v-if="item.shift.venue.name"
                >
                  <v-avatar left>
                    <v-icon>mdi-home</v-icon>
                  </v-avatar>
                  {{ formatVenueName(item.shift.venue) }}
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.shift.artist"
                >
                  <v-avatar left>
                    <v-icon>mdi-account-music</v-icon>
                  </v-avatar>
                  {{ item.shift.artist.name }}
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
                    {{ item.shift.doors }}
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
                    {{ item.shift.check_in }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.shift.venue.name"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ formatVenueName(item.shift.venue) }}
                  </v-chip>
                </template>
              </div>
            </v-toolbar-title>
          </v-toolbar>
        </div>

        <div class="list-header list-header--shifts">
          <h4>Past Shifts</h4>
        </div>
        <div v-if="shiftsListVisible">
          <v-toolbar
            flat
            class="search-result"
            style="margin-bottom: 10px"
            v-for="item in getPastShifts(volunteer_shifts)"
            :key="item.id"
          >
            <v-toolbar-title class="flex-grow-1">
              <router-link
                :to="{
                  name: 'ShiftShow',
                  params: { id: item.shift.event_id, shift_id: item.shift.id },
                }"
                class="flex flex-grow-1"
              >
                <strong v-if="item.shift.name">{{ item.shift.name }}</strong>
                <strong v-else>
                  {{
                    item.shift.start_date | moment("dddd MMM D, YYYY")
                  }}</strong
                >
                <strong v-if="item.shift.event">
                  - {{ item.shift.event.name }}</strong
                >
                <strong
                  v-if="item.shift.venue.state_text && item.shift.venue.city"
                >
                  - {{ item.shift.venue.city }},
                  {{ item.shift.venue.state_text }}
                </strong>
              </router-link>
              <div v-if="item.shift.event.teams" class="mt-2 d-flex flex-wrap">
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
                    <span v-if="item.shift.event.teams">
                      <ul class="schedule-items-list">
                        <li
                          v-for="scheduleItem in item.shift.shift_schedules"
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
                  v-if="item.shift.venue.name"
                >
                  <v-avatar left>
                    <v-icon>mdi-home</v-icon>
                  </v-avatar>
                  {{ formatVenueName(item.shift.venue) }}
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.shift.artist"
                >
                  <v-avatar left>
                    <v-icon>mdi-account-music</v-icon>
                  </v-avatar>
                  {{ item.shift.artist.name }}
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
                    {{ item.shift.doors }}
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
                    {{ item.shift.check_in }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.shift.venue.name"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ formatVenueName(item.shift.venue) }}
                  </v-chip>
                </template>
              </div>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="item.accepted || item.confirmed || item.declined || item.pending || item.attended"
                  >
                    <v-avatar left>
                      <v-icon>mdi-check</v-icon>
                    </v-avatar>
                    {{ formatStatus(item) }}
                  </v-chip>
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
    emails: Array,
    volunteer_shifts: Array,
  },

  data() {
    return {
      emailListVisible: true,
      shiftsListVisible: true,
    };
  },

  methods: {
    formatStatus(volunteer_shift) {
      if (volunteer_shift.attended)
        return "Attended";
      else if (volunteer_shift.accepted)
        return "Accepted";
      else if (volunteer_shift.declined)
        return "Declined";
      else if (volunteer_shift.confirmed)
        return "Confirmed";
      else if (volunteer_shift.pending)
        return "Pending";
      else return "";
    },

    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else return venue.name;
    },

    getFilteredShifts(volunteer_shifts) {
      return volunteer_shifts.filter(
        (volunteer_shift) =>
          volunteer_shift.shift && volunteer_shift.shift.event_id != null
      );
    },

    getUpcomingShifts(volunteer_shifts) {
      return volunteer_shifts.filter(
        (volunteer_shift) =>
          volunteer_shift.shift && volunteer_shift.shift.end_date >= moment().format('YYYY-MM-DD')
      );
    },

    getPastShifts(volunteer_shifts) {
      return volunteer_shifts.filter(
        (volunteer_shift) =>
          volunteer_shift.shift && volunteer_shift.shift.end_date < moment().format('YYYY-MM-DD')
      );
    },

    convertTime(input) {
      return moment(input, "HH:mm:ss").format("h:mm A");
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
.tab-emails {
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
.list-header--emails {
  background: #dc3036;
}
.list-header--shifts {
  background: #2196f3;
}
</style>
