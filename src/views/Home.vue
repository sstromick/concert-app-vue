<template>
  <div v-if="stats && events && shifts && volunteers" class="home">
    <v-container fluid>
      <v-row class="mb-12">
        <v-col cols="12" md="6" lg>
          <router-link
            :to="{ name: 'EventsFilter', params: { filter: 'active' } }"
          >
            <v-card outlined class="card-count text-center events-active">
              <v-card-text class="stat-block">
                <div
                  v-if="stats.num_active_events"
                  class="stat-block__number font-weight-bold"
                >
                  {{ stats.num_active_events.toLocaleString() }}
                </div>
                <div class="stat-block__text">Active Events</div>
                <div class="stat-block__cta">VIEW EVENTS</div>
              </v-card-text>
            </v-card>
          </router-link>
        </v-col>

        <v-col cols="12" md="6" lg>
          <router-link
            :to="{ name: 'ShiftsIndex', params: { filter: 'upcoming' } }"
          >
            <v-card outlined class="card-count text-center upcoming-shifts">
              <v-card-text class="stat-block">
                <div
                  v-if="stats.num_upcoming_shifts"
                  class="stat-block__number font-weight-bold"
                >
                  {{ stats.num_upcoming_shifts.toLocaleString() }}
                </div>
                <div class="stat-block__text">Upcoming Shifts</div>
                <div class="stat-block__cta">VIEW SHIFTS</div>
              </v-card-text>
            </v-card>
          </router-link>
        </v-col>

        <v-col cols="12" md="6" lg>
          <router-link
            :to="{
              name: 'EventsPendingVolunteers',
            }"
          >
            <v-card outlined class="card-count text-center voluteers-pending">
              <v-card-text class="stat-block">
                <div
                  v-if="stats.num_pending_volunteers"
                  class="stat-block__number font-weight-bold"
                >
                  {{ stats.num_pending_volunteers.toLocaleString() }}
                </div>
                <div class="stat-block__text">Pending Volunteers</div>
                <div class="stat-block__cta">VIEW ALL</div>
              </v-card-text>
            </v-card>
          </router-link>
        </v-col>

        <v-col cols="12" md="6" lg>
          <router-link :to="{ name: 'Events' }">
            <v-card outlined class="card-count text-center events-to-date">
              <v-card-text class="stat-block">
                <div
                  v-if="stats.num_events"
                  class="stat-block__number font-weight-bold"
                >
                  {{ stats.num_events.toLocaleString() }}
                </div>
                <div class="stat-block__text">Events to Date</div>
                <div class="stat-block__cta">SEE DETAILS</div>
              </v-card-text>
            </v-card>
          </router-link>
        </v-col>

        <v-col cols="12" md="6" lg>
          <router-link :to="{ name: 'VolunteersIndex' }">
            <v-card outlined class="card-count text-center volunteers-to-date">
              <v-card-text class="stat-block">
                <div
                  v-if="stats.num_volunteers"
                  class="stat-block__number font-weight-bold"
                >
                  {{ stats.num_volunteers.toLocaleString() }}
                </div>
                <div class="stat-block__text">Volunteers to Date</div>
                <div class="stat-block__cta">SEE DETAILS</div>
              </v-card-text>
            </v-card>
          </router-link>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" lg="7">
          <div class="d-flex flex-column">
            <v-toolbar
              flat
              class="d-flex list-header events-active flex-grow-1"
            >
              <v-toolbar-title v-if="events.total" class="flex-grow-1"
                >Active Events ({{
                  events.total.toLocaleString()
                }})</v-toolbar-title
              >
              <div>
                <router-link
                  :to="{ name: 'EventsFilter', params: { filter: 'active' } }"
                  >View All</router-link
                >
              </div>
            </v-toolbar>
            <v-toolbar
              flat
              class="search-result"
              v-for="item in events.data"
              :key="item.id"
            >
              <v-toolbar-title>
                <router-link
                  :to="{ name: 'EventShifts', params: { id: item.id } }"
                  class="flex flex-grow-1"
                  ><strong>{{ eventTitle(item) }}</strong>
                </router-link>
                <div class="mt-2 d-flex flex-wrap">
                  <v-menu
                    :open-on-hover="true"
                    offset-y
                    class="tooltip-menu"
                    max-width="99%"
                  >
                    <template v-slot:activator="{ on }">
                      <v-chip
                        class="mr-2 mb-2"
                        color="blue-grey"
                        text-color="white"
                        v-on="on"
                        v-if="item.contacts.length"
                      >
                        <v-avatar left>
                          <v-icon>mdi-account-circle</v-icon>
                        </v-avatar>
                        Contacts
                      </v-chip>
                      <v-chip
                        class="mr-2 mb-2"
                        color="blue-grey"
                        text-color="white"
                        v-if="item.start_date && item.end_date"
                      >
                        <v-avatar left>
                          <v-icon>mdi-calendar</v-icon>
                        </v-avatar>
                        {{ item.start_date | moment("MMM D, YYYY") }} -
                        {{ item.end_date | moment("MMM D, YYYY") }}
                      </v-chip>
                      <v-chip
                        class="mr-2 mb-2"
                        color="blue-grey"
                        text-color="white"
                        v-if="item.artist"
                      >
                        <v-avatar left>
                          <v-icon>mdi-account-music</v-icon>
                        </v-avatar>
                        {{ item.artist.name }}
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
                    <div class="tooltip" v-if="item.contacts">
                      <span v-for="(c, index) in item.contacts" :key="index">
                        <p class="subtitle my-2">
                          {{ c.contact_master.name }}<br />
                          <v-btn
                            text
                            class="px-0 py-1 primary--text btn-tooltip"
                            @click.stop="showDialog(c.contact_master.email)"
                          >
                            {{ c.contact_master.email }}
                          </v-btn>
                          {{ formatPhoneNumber(c.contact_master.phone) }}
                        </p>
                      </span>
                    </div>
                  </v-menu>
                </div>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <div class="my-auto mx-4">
                <v-icon v-if="item.teams">mdi-account-multiple</v-icon>
                <v-icon v-else>mdi-account</v-icon>
              </div>
              <div class="my-auto m-x-4">
                <v-chip
                  class="mb-2"
                  color="green"
                  text-color="white"
                  v-if="checkActive(item)"
                  >Active</v-chip
                >
                <v-chip
                  class="mb-2"
                  text-color="green"
                  v-if="!checkActive(item)"
                  >Inactive</v-chip
                >
              </div>
            </v-toolbar>
          </div>
          <div class="mt-10">
            <v-toolbar
              flat
              class="d-flex list-header upcoming-shifts flex-grow-1"
            >
              <v-toolbar-title v-if="shifts.total" class="flex-grow-1"
                >Upcoming Shifts ({{
                  shifts.total.toLocaleString()
                }})</v-toolbar-title
              >
            </v-toolbar>
            <v-toolbar
              flat
              class="search-result"
              v-for="s in shifts.data"
              :key="s.id"
            >
              <v-toolbar-title class="flex-grow-1">
                <router-link
                  :to="{
                    name: 'ShiftShow',
                    params: { id: s.event_id, shift_id: s.id },
                  }"
                  class="flex flex-grow-1"
                >
                  <strong>{{ shiftTitle(s) }}</strong>
                </router-link>
                <div v-if="s.event.teams" class="mt-2 d-flex flex-wrap">
                  <v-menu
                    :open-on-hover="false"
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
                      <span v-if="s.event.teams">
                        <ul class="schedule-items-list">
                          <li
                            v-for="scheduleItem in s.shift_schedules"
                            :key="scheduleItem.id"
                          >
                            <strong>{{
                              scheduleItem.start_date
                                | moment("dddd MMM D, YYYY")
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
                    v-if="s.venue"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ formatVenueName(s.venue) }}
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
                      {{ s.doors }}
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
                      {{ s.check_in }}
                    </v-chip>
                    <v-chip
                      class="mr-2 mb-2"
                      color="blue-grey"
                      text-color="white"
                      v-if="s.venue"
                    >
                      <v-avatar left>
                        <v-icon>mdi-home</v-icon>
                      </v-avatar>
                      {{ formatVenueName(s.venue) }}
                    </v-chip>
                  </template>
                </div>
                <div class="mt-2">
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                  >
                    <v-avatar left>
                      <v-icon>mdi-calendar-text</v-icon>
                    </v-avatar>
                    {{ s.event.name }}
                  </v-chip>
                  <v-menu
                    :open-on-hover="true"
                    offset-y
                    class="tooltip-menu"
                    max-width="99%"
                  >
                    <template v-slot:activator="{ on }">
                      <v-chip
                        class="mr-2 mb-2"
                        color="blue-grey"
                        text-color="white"
                        v-on="on"
                        v-if="s.event.contacts.length"
                      >
                        <v-avatar left>
                          <v-icon>mdi-account-circle</v-icon>
                        </v-avatar>
                        Contacts
                      </v-chip>
                    </template>
                    <div class="tooltip" v-if="s.event.contacts">
                      <span v-for="(c, index) in s.event.contacts" :key="index">
                        <p class="subtitle my-2">
                          {{ c.contact_master.name }}<br />
                          <v-btn
                            text
                            class="px-0 py-1 primary--text btn-tooltip"
                            @click.stop="showDialog(c.contact_master.email)"
                          >
                            {{ c.contact_master.email }}
                          </v-btn>
                          {{ formatPhoneNumber(c.contact_master.phone) }}
                        </p>
                      </span>
                    </div>
                  </v-menu>
                </div>
              </v-toolbar-title>
            </v-toolbar>
          </div>
        </v-col>

        <v-col>
          <v-toolbar
            flat
            class="d-flex list-header voluteers-pending flex-grow-1"
          >
            <v-toolbar-title v-if="volunteers.total" class="flex-grow-1"
              >Pending Volunteers ({{
                volunteers.total.toLocaleString()
              }})</v-toolbar-title
            >
            <div>
              <router-link :to="{ name: 'EventsPendingVolunteers' }"
                >View All</router-link
              >
            </div>
          </v-toolbar>
          <div>
            <v-toolbar
              flat
              class="search-result"
              v-for="(v, index) in volunteers.data"
              :key="index"
            >
              <v-toolbar-title class="d-flex flex-column" v-if="v.pending">
                <router-link
                  :to="{ name: 'EventShifts', params: { id: v.id } }"
                  class="flex flex-grow-1"
                >
                  <v-menu :open-on-hover="true" :offset-y="true">
                    <template v-slot:activator="{ on }">
                      <strong v-on="on">
                        {{ v.first_name + " " + v.last_name }} applied
                        to</strong
                      >
                    </template>
                    <v-list>
                      <v-list-item>
                        {{ v.note }}
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </router-link>
                <div class="d-flex flex-wrap mt-2">
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="v.name"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ formatVenueName(v) }}
                  </v-chip>
                  <v-chip
                    v-if="v.tshirt_size"
                    class="mr-2 d-flex flex-column mb-2"
                    color="blue-grey"
                    text-color="white"
                  >
                    <v-avatar left> <v-icon>mdi-tshirt-crew</v-icon> </v-avatar>
                    <span class="capitalize">{{ v.tshirt_size }}</span>
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="v.phone"
                  >
                    <v-avatar left>
                      <v-icon>mdi-phone</v-icon>
                    </v-avatar>
                    <span>{{ v.phone }}</span>
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="v.artist_name"
                  >
                    <v-avatar left>
                      <v-icon>mdi-account-music</v-icon>
                    </v-avatar>
                    {{ v.artist_name }}
                  </v-chip>
                </div>
              </v-toolbar-title>
            </v-toolbar>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "Home",

  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      events: "events/events",
      volunteers: "volunteers/volunteers",
      shifts: "shifts/shifts",
      stats: "stats/stats",
    }),
  },

  methods: {
    formatVenueName(venue) {
      if (venue.city)
        return venue.name + " - " + venue.city + ", " + venue.state_text;
      else return venue.name;
    },

    formatNum(number) {
      return number.toLocaleString();
    },

    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }

      return null;
    },
    convertTime(input) {
      return moment(input, "HH:mm:ss").format("h:mm A");
    },

    checkActive(item) {
      return moment().isBefore(moment(item.end_date, "YYYY-MM-DD"), "days");
    },

    futureShift(item) {
      return moment(item.start_date).diff(moment()) >= 0;
    },

    eventTitle(item) {
      const separator = " - ";
      let eventTitle = "";
      let artistName = item.artist ? item.artist.name : null;
      let eventYear = item.start_date ? moment(item.start_date).year() : null;
      let eventName = item.name;

      if (artistName) eventTitle += artistName;
      if (eventYear) eventTitle += separator + eventYear;
      if (eventName) eventTitle += separator + eventName;

      return eventTitle;
    },

    shiftTitle(item) {
      const separator = " - ";
      let shiftTitle = "";
      let artistName = item.artist ? item.artist.name : null;
      let eventArtistName = item.event.artist ? item.event.artist.name : null;
      let eventYear = item.start_date
        ? moment(item.start_date).format("dddd MMM D, YYYY")
        : null;
      let eventName = item.event.name;

      if (artistName) shiftTitle += artistName;
      else if (eventArtistName) shiftTitle += eventArtistName;
      if (eventYear) shiftTitle += separator + eventYear;
      if (eventName) shiftTitle += separator + eventName;

      return shiftTitle;
    },
  },

  watch: {},

  mounted() {
    this.$store.dispatch("stats/stats");
    this.$store.dispatch("events/searchEvents", "filter[active]=y");
    this.$store.dispatch(
      "volunteers/getPendingVolunteers",
      "filter[pending]=1"
    );
    this.$store.dispatch(
      "shifts/searchShifts",
      "filter[starts_after]=" +
        moment().format("YYYY-MM-DD") +
        "&sort=start_date"
    );
  },
};
</script>

<style scoped>
.stat-block {
  color: #fff !important;
}

.stat-block__number {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.stat-block__text {
  font-size: 1.25rem;
}

.stat-block__cta {
  margin-top: 1.8rem;
  font-size: 0.81rem;
}

.event-data {
  flex-basis: 35%;
  font-size: 1.2rem;
}

.event-data__contact {
  color: #6d6d6d;
  font-size: 1rem;
  display: flex;
  margin-top: 0.3rem;
}

.event-data__contact--icon {
  font-size: 1rem;
  margin-right: 0.2rem;
}

.list-header {
  margin-bottom: 1rem;
  color: #fff;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-header a {
  color: #fff !important;
}

.card-count {
  min-height: 8.5rem;
}

.events-active {
  background: #3f51b5 !important;
}

.voluteers-pending {
  background: #dc3036 !important;
  height: 100%;
}

.upcoming-shifts {
  background: #2196f3 !important;
  height: 100%;
}

.events-to-date {
  background: #009688;
}

.volunteers-to-date {
  background: #4caf50;
}

.circle {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  border-radius: 100%;
  background: #eee;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
}

.shift-details {
  font-size: 1rem !important;
  margin-top: 0.6rem;
}

.shift-details .v-icon {
  font-size: 1rem;
  margin-right: 5px;
}

.icons {
  font-size: 0.7rem;
}

.icon {
  padding: 1rem;
}
.capitalize {
  text-transform: uppercase;
}
</style>
<style>
.list-header .v-toolbar__content {
  flex-grow: 1 !important;
}
</style>
