<template>
  <v-flex>
    <v-row class="mb-8 mt-8">
      <v-col>
        <v-card
          outlined
          class="tab tab-accepted text-center"
          :class="[acceptedListVisible ? 'tab-active' : 'tab-not-active']"
          @click="togleAcceptedTab()"
        >
          <v-card-text>
            <div class="subheading font-weight-bold">
              {{ acceptedCount }}
            </div>
            <div class="card-text">Accepted</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          outlined
          class="tab tab-pending text-center"
          :class="[pendingListVisible ? 'tab-active' : 'tab-not-active']"
          @click="toglePendingTab()"
        >
          <v-card-text>
            <div class="subheading font-weight-bold">
              {{ pendingList.length }}
            </div>
            <div class="card-text">Pending</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          outlined
          class="tab tab-declined text-center"
          :class="[declinedListVisible ? 'tab-active' : 'tab-not-active']"
          @click="togleDeclinedTab()"
        >
          <v-card-text>
            <div class="subheading font-weight-bold">
              {{ declinedList.length }}
            </div>
            <div class="card-text">Declined</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          outlined
          class="tab tab-waitlisted text-center"
          :class="[waitlistListVisible ? 'tab-active' : 'tab-not-active']"
          @click="togleWaitlistTab()"
        >
          <v-card-text>
            <div class="subheading font-weight-bold">
              {{ waitlistList.length }}
            </div>
            <div class="card-text">Waitlisted</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card
          outlined
          class="tab tab-nonprofits text-center"
          :class="[npAllVisible ? 'tab-active' : 'tab-not-active']"
          @click="nonprofitsTabClick"
        >
          <v-card-text>
            <div class="subheading font-weight-bold">
              {{ shift.non_profit_shifts.length }}
            </div>
            <div class="card-text">Nonprofits</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="search"
          clearable
          light
          outlined
          solo
          flat
          hide-details
          append-inner-icon="mdi-magnify"
          :label="searchLabel"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="!npAllVisible && acceptedListVisible">
      <draggable
        :list="teams"
        group="people"
        class="teams"
        ghostClass="ghost"
        :options="{ disabled: true }"
      >
        <v-col class="team" v-for="(t, index) in teams" :key="index">
          <div class="list-header list-header--accepted">
            <h4>{{ t.name }}</h4>
            <v-menu
              :open-on-hover="true"
              offset-y
              class="tooltip-menu"
              max-width="99%"
              v-if="t.shift_schedules.length > 0"
            >
              <template v-slot:activator="{ on }"
                ><h4 v-on="on">Schedule</h4></template
              >
              <div class="tooltip">
                <span>
                  <ul class="schedule-items-list">
                    <li
                      v-for="(scheduleItem, index3) in t.shift_schedules"
                      :key="index3"
                    >
                      <strong>{{
                        scheduleItem.start_date | moment("dddd MMM D, YYYY")
                      }}</strong
                      ><br />Doors: {{ (scheduleItem.doors) }} |
                      Check:
                      {{ (scheduleItem.check_in) }}
                    </li>
                  </ul>
                </span>
              </div>
            </v-menu>
          </div>
          <draggable
            :list="t.volunteer_shifts"
            group="people"
            ghostClass="ghost"
            @change="volunteerShiftsHaveUpdates = true"
          >
            <div
              v-for="(v, index2) in filteredTeam(t.volunteer_shifts)"
              :key="index2"
            >
              <v-card outlined class="name-card" v-if="v.volunteer">
                <v-card-title class="pb-0">
                  <router-link
                    :to="{
                      name: 'VolunteerShow',
                      params: { id: v.volunteer.id },
                    }"
                    target="_blank"
                  >
                    <v-menu offset-y open-on-hover v-if="v.note">
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          {{
                            v.volunteer.first_name + " " + v.volunteer.last_name
                          }}
                        </span>
                      </template>
                      <v-list>
                        <v-list-item>
                          <v-list-item-title>{{ v.note }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <div v-else>
                      {{ v.volunteer.first_name + " " + v.volunteer.last_name }}
                    </div>
                  </router-link>
                </v-card-title>
                <v-card-text class="d-flex align-center">
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="v.volunteer && v.volunteer.tshirt_size"
                  >
                    <v-avatar left>
                      <v-icon>mdi-tshirt-crew</v-icon>
                    </v-avatar>
                    <span class="capitalize">{{
                      v.volunteer.tshirt_size
                    }}</span>
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-on="on"
                    v-if="v.volunteer.city && v.volunteer.state"
                  >
                    <v-avatar left>
                      <v-icon>mdi-home</v-icon>
                    </v-avatar>
                    {{ v.volunteer.city }},
                    {{ v.volunteer.state.abbreviation }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="blue-grey"
                    text-color="white"
                    v-if="v.confirmed"
                  >
                    <v-avatar left>
                      <v-icon>mdi-check</v-icon>
                    </v-avatar>
                    <span class="capitalize">Confirmed</span>
                  </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="v.volunteer.phone"
                >
                  <v-avatar left>
                    <v-icon>mdi-phone</v-icon>
                  </v-avatar>
                  <span>{{ v.volunteer.phone }}</span>
                </v-chip>
                </v-card-text>
              </v-card>
            </div>
          </draggable>
        </v-col>
      </draggable>
    </v-row>

    <v-row>
      <v-col v-if="pendingListVisible">
        <div class="list-header list-header--pending">
          <h4>Pending</h4>
        </div>
        <draggable
          :list="pendingList"
          group="people"
          ghostClass="ghost"
          @change="volunteerShiftsHaveUpdates = true"
        >
          <div v-for="item in filteredPendingList" :key="item.id">
            <v-card outlined class="name-card" v-if="item.volunteer">
              <v-card-title class="pb-0">
                <router-link
                  :to="{
                    name: 'VolunteerShow',
                    params: { id: item.volunteer.id },
                  }"
                  target="_blank"
                >
                  <v-menu offset-y open-on-hover v-if="item.note">
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        {{
                          item.volunteer.first_name +
                            " " +
                            item.volunteer.last_name
                        }}
                      </span>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>{{ item.note }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <div v-else>
                    {{
                      item.volunteer.first_name + " " + item.volunteer.last_name
                    }}
                  </div>
                </router-link>
              </v-card-title>
              <v-card-text class="d-flex align-center">
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.volunteer && item.volunteer.tshirt_size"
                >
                  <v-avatar left>
                    <v-icon>mdi-tshirt-crew</v-icon>
                  </v-avatar>
                  <span class="capitalize">{{
                    item.volunteer.tshirt_size
                  }}</span>
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-on="on"
                  v-if="item.volunteer.city && item.volunteer.state"
                >
                  <v-avatar left>
                    <v-icon>mdi-home</v-icon>
                  </v-avatar>
                  {{ item.volunteer.city }},
                  {{ item.volunteer.state.abbreviation }}
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.confirmed"
                >
                  <v-avatar left>
                    <v-icon>mdi-check</v-icon>
                  </v-avatar>
                  <span class="capitalize">Confirmed</span>
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.volunteer.phone"
                >
                  <v-avatar left>
                    <v-icon>mdi-phone</v-icon>
                  </v-avatar>
                  <span>{{ item.volunteer.phone }}</span>
                </v-chip>
              </v-card-text>
            </v-card>
          </div>
        </draggable>
      </v-col>

      <v-col v-if="waitlistListVisible">
        <div class="list-header list-header--waitlist">
          <h4>Waitlist</h4>
        </div>
        <draggable
          :list="waitlistList"
          group="people"
          ghostClass="ghost"
          @change="volunteerShiftsHaveUpdates = true"
        >
          <div v-for="item in filteredWaitlistList" :key="item.id">
            <v-card outlined class="name-card" v-if="item.volunteer">
              <v-card-title class="pb-0">
                <router-link
                  :to="{
                    name: 'VolunteerShow',
                    params: { id: item.volunteer.id },
                  }"
                  target="_blank"
                >
                  <v-menu offset-y open-on-hover v-if="item.note">
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        {{
                          item.volunteer.first_name +
                            " " +
                            item.volunteer.last_name
                        }}
                      </span>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>{{ item.note }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <div v-else>
                    {{
                      item.volunteer.first_name + " " + item.volunteer.last_name
                    }}
                  </div>
                </router-link>
              </v-card-title>
              <v-card-text class="d-flex align-center">
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.volunteer && item.volunteer.tshirt_size"
                >
                  <v-avatar left>
                    <v-icon>mdi-tshirt-crew</v-icon>
                  </v-avatar>
                  <span class="capitalize">{{
                    item.volunteer.tshirt_size
                  }}</span>
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-on="on"
                  v-if="item.volunteer.city && item.volunteer.state"
                >
                  <v-avatar left>
                    <v-icon>mdi-home</v-icon>
                  </v-avatar>
                  {{ item.volunteer.city }},
                  {{ item.volunteer.state.abbreviation }}
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.confirmed"
                >
                  <v-avatar left>
                    <v-icon>mdi-check</v-icon>
                  </v-avatar>
                  <span class="capitalize">Confirmed</span>
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.volunteer.phone"
                >
                  <v-avatar left>
                    <v-icon>mdi-phone</v-icon>
                  </v-avatar>
                  <span>{{ item.volunteer.phone }}</span>
                </v-chip>
              </v-card-text>
            </v-card>
          </div>
        </draggable>
      </v-col>

      <v-col v-if="declinedListVisible">
        <div class="list-header list-header--declined">
          <h4>Declined</h4>
        </div>
        <draggable
          :list="declinedList"
          group="people"
          ghostClass="ghost"
          @change="volunteerShiftsHaveUpdates = true"
        >
          <div v-for="item in filteredDeclinedList" :key="item.id">
            <v-card outlined class="name-card" v-if="item.volunteer">
              <v-card-title class="pb-0">
                <router-link
                  :to="{
                    name: 'VolunteerShow',
                    params: { id: item.volunteer.id },
                  }"
                  target="_blank"
                >
                  <v-menu offset-y open-on-hover v-if="item.note">
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        {{
                          item.volunteer.first_name +
                            " " +
                            item.volunteer.last_name
                        }}
                      </span>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title>{{ item.note }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <div v-else>
                    {{
                      item.volunteer.first_name + " " + item.volunteer.last_name
                    }}
                  </div>
                </router-link>
              </v-card-title>
              <v-card-text class="d-flex align-center">
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.volunteer && item.volunteer.tshirt_size"
                >
                  <v-avatar left>
                    <v-icon>mdi-tshirt-crew</v-icon>
                  </v-avatar>
                  <span class="capitalize">{{
                    item.volunteer.tshirt_size
                  }}</span>
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-on="on"
                  v-if="item.volunteer.city && item.volunteer.state"
                >
                  <v-avatar left>
                    <v-icon>mdi-home</v-icon>
                  </v-avatar>
                  {{ item.volunteer.city }},
                  {{ item.volunteer.state.abbreviation }}
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.confirmed"
                >
                  <v-avatar left>
                    <v-icon>mdi-check</v-icon>
                  </v-avatar>
                  <span class="capitalize">Confirmed</span>
                </v-chip>
                <v-chip
                  class="mr-2 mb-2"
                  color="blue-grey"
                  text-color="white"
                  v-if="item.volunteer.phone"
                >
                  <v-avatar left>
                    <v-icon>mdi-phone</v-icon>
                  </v-avatar>
                  <span>{{ item.volunteer.phone }}</span>
                </v-chip>
              </v-card-text>
            </v-card>
          </div>
        </draggable>
      </v-col>

      <v-col v-if="npAttendingVisible">
        <div class="list-header list-header--npAttending">
          <h4>Attending</h4>
        </div>
        <draggable
          v-if="attendingNonprofitsList"
          :list="attendingNonprofitsList"
          group="np"
          ghostClass="ghost"
          @change="attendingChange"
        >
          <div v-for="item in filteredAttendingNonprofitsList" :key="item.id">
            <v-card outlined class="name-card">
              <v-card-title class="">
                <router-link
                  :to="{
                    name: 'NonprofitShow',
                    params: { id: item.non_profit.id },
                  }"
                  target="_blank"
                >
                  {{ item.non_profit.name }}
                </router-link>
              </v-card-title>
            </v-card>
          </div>
        </draggable>
      </v-col>
      <v-col v-if="npAllVisible">
        <div class="list-header list-header--npAll">
          <h4>All</h4>
        </div>
        <draggable
          v-if="nonprofitsList"
          :list="nonprofitsList"
          group="np"
          ghostClass="ghost"
          @change="nonprofitsChange"
        >
          <div v-for="item in filteredNonprofitsList" :key="item.id">
            <v-card outlined class="name-card">
              <v-card-title class="">
                <router-link
                  :to="{
                    name: 'NonprofitShow',
                    params: { id: item.non_profit.id },
                  }"
                  target="_blank"
                >
                  {{ item.non_profit.name }}
                </router-link>
              </v-card-title>
            </v-card>
          </div>
        </draggable>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          depressed
          color="primary"
          fixed
          bottom
          fab
          small
          right
          @click="update"
          v-if="volunteerShiftsHaveUpdates || nonprofitsHaveUpdates"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
import moment from "moment";
import draggable from "vuedraggable";

export default {
  name: "ShiftTeamTabs",

  components: {
    draggable,
  },

  props: {
    shift: Object,
    shifts: Array,
    nonprofits: Array,
  },

  data() {
    return {
      teams: [],
      search: "",
      searchLabel: "Search Volunteers",
      waitlistList: [],
      declinedList: [],
      pendingList: [],
      nonprofitsList: [],
      attendingNonprofitsList: [],
      acceptedCount: 0,

      acceptedListVisible: true,
      waitlistListVisible: true,
      declinedListVisible: true,
      pendingListVisible: true,
      npAttendingVisible: false,
      npAllVisible: false,
      volunteerShiftsHaveUpdates: false,
      nonprofitsHaveUpdates: false,

      volunteerShiftData: {
        accepted_ids: [],
        declined_ids: [],
        pending_ids: [],
        waitlist_ids: [],
        nonprofit_ids: [],
      },

      nonprofitShiftData: {
        shift_id: 0,
        added_nonprofits: [],
        deleted_nonprofits: [],
      },
    };
  },

  computed: {
    filteredNonprofitsList: function() {
      return this.nonprofitsList.filter((item) => {
        let str = new RegExp(this.search, "i");
        return item.non_profit.name.match(str);
      });
    },

    filteredAttendingNonprofitsList: function() {
      return this.attendingNonprofitsList.filter((item) => {
        let str = new RegExp(this.search, "i");
        return item.non_profit.name.match(str);
      });
    },

    filteredDeclinedList: function() {
      return this.declinedList.filter((item) => {
        let str = new RegExp(this.search, "i");
        return (
          item.volunteer.first_name.match(str) ||
          item.volunteer.last_name.match(str)
        );
      });
    },

    filteredPendingList: function() {
      return this.pendingList.filter((item) => {
        let str = new RegExp(this.search, "i");
        return (
          item.volunteer.first_name.match(str) ||
          item.volunteer.last_name.match(str)
        );
      });
    },

    filteredWaitlistList: function() {
      return this.waitlistList.filter((item) => {
        let str = new RegExp(this.search, "i");
        return (
          item.volunteer.first_name.match(str) ||
          item.volunteer.last_name.match(str)
        );
      });
    },
  },

  methods: {
    convertTime(input) {
      return moment(input, "HH:mm:ss").format("h:mm A");
    },

    filteredTeam: function(volunteersArray) {
      var textSearch = this.search;
      return volunteersArray.filter(function(el) {
        return (
          el.volunteer.first_name
            .toLowerCase()
            .indexOf(textSearch.toLowerCase()) !== -1 ||
          el.volunteer.last_name
            .toLowerCase()
            .indexOf(textSearch.toLowerCase()) !== -1
        );
      });
    },

    attendingChange: function(evt) {
      this.nonprofitsHaveUpdates = true;
      if ("added" in evt)
        this.nonprofitShiftData.added_nonprofits.push(evt.added.element.id);
    },

    nonprofitsChange: function(evt) {
      this.nonprofitsHaveUpdates = true;
      if ("added" in evt)
        this.nonprofitShiftData.deleted_nonprofits.push(evt.added.element.id);
    },

    nonprofitsTabClick: function() {
      this.acceptedListVisible = false;
      this.npAttendingVisible = true;
      this.npAllVisible = true;
      this.waitlistListVisible = false;
      this.declinedListVisible = false;
      this.searchLabel = "Search Nonprofits";
    },

    togleDeclinedTab: function() {
      this.declinedListVisible = !this.declinedListVisible;
      this.hideNonProfitTabs();
    },

    toglePendingTab: function() {
      this.pendingListVisible = !this.pendingListVisible;
      this.hideNonProfitTabs();
    },

    togleAcceptedTab: function() {
      this.acceptedListVisible = !this.acceptedListVisible;
      this.hideNonProfitTabs();
    },

    togleWaitlistTab: function() {
      this.waitlistListVisible = !this.waitlistListVisible;
      this.hideNonProfitTabs();
    },

    hideNonProfitTabs: function() {
      this.npAllVisible = false;
      this.npAttendingVisible = false;
      this.searchLabel = "Search Volunteers";
    },

    removeDuplicates: function(a, b) {
      for (var i = 0, len = a.length; i < len; i++) {
        for (var j = 0, len2 = b.length; j < len2; j++) {
          if (a[i].non_profit_id === b[j].id) {
            b.splice(j, 1);
            len2 = b.length;
          }
        }
      }
    },

    update: function() {
      //clear arrays about to be added to
      this.volunteerShiftData.accepted_ids.splice(
        0,
        this.volunteerShiftData.accepted_ids.length
      );
      this.volunteerShiftData.declined_ids.splice(
        0,
        this.volunteerShiftData.declined_ids.length
      );
      this.volunteerShiftData.waitlist_ids.splice(
        0,
        this.volunteerShiftData.waitlist_ids.length
      );
      this.volunteerShiftData.pending_ids.splice(
        0,
        this.volunteerShiftData.pending_ids.length
      );

      //Volunteer Updates
      if (this.volunteerShiftsHaveUpdates) {
        for (let i = 0; i < this.teams.length; i++) {
          for (let j = 0; j < this.teams[i].volunteer_shifts.length; j++) {
            this.volunteerShiftData.accepted_ids.push({
              id: this.teams[i].volunteer_shifts[j].id,
              shift_id: this.teams[i].id,
            });
          }
        }

        for (let i = 0; i < this.declinedList.length; i++)
          this.volunteerShiftData.declined_ids.push(this.declinedList[i].id);

        for (let i = 0; i < this.pendingList.length; i++)
          this.volunteerShiftData.pending_ids.push(this.pendingList[i].id);

        for (let i = 0; i < this.waitlistList.length; i++)
          this.volunteerShiftData.waitlist_ids.push(this.waitlistList[i].id);

        this.$store.dispatch(
          "volunteer_shifts/updateShiftsStatus",
          this.volunteerShiftData
        );
      }

      //Nonprofit Updates
      if (
        this.nonprofitShiftData.added_nonprofits.length > 0 ||
        this.nonprofitShiftData.deleted_nonprofits.length > 0
      ) {
        this.nonprofitShiftData.shift_id = this.shift.id;
        this.$store.dispatch(
          "nonprofit_shifts/updateNonprofitShifts",
          this.nonprofitShiftData
        );
      }
    },
  },

  watch: {
    search() {
      if (this.search == null) this.search = "";
    },

    shifts() {
      let newItem = null;
      this.teams = [];
      this.waitlistList = [];
      this.declinedList = [];
      this.pendingList = [];
      this.acceptedCount = 0;

      for (let s = 0; s < this.shifts.length; s++) {
        newItem = null;
        newItem = {
          id: this.shifts[s].id,
          name: this.shifts[s].name,
          shift_schedules: [],
          volunteer_shifts: [],
        };
        this.teams.push(newItem);
        for (let ss = 0; ss < this.shifts[s].shift_schedules.length; ss++) {
          this.teams[s].shift_schedules.push(
            this.shifts[s].shift_schedules[ss]
          );
        }

        for (let vs = 0; vs < this.shifts[s].volunteer_shifts.length; vs++) {
          if (this.shifts[s].volunteer_shifts[vs].declined) {
            this.declinedList.push(this.shifts[s].volunteer_shifts[vs]);
          }

          if (this.shifts[s].volunteer_shifts[vs].pending) {
            this.pendingList.push(this.shifts[s].volunteer_shifts[vs]);
          }

          if (this.shifts[s].volunteer_shifts[vs].accepted) {
            this.acceptedCount++;
            this.teams[s].volunteer_shifts.push(
              this.shifts[s].volunteer_shifts[vs]
            );
          }

          if (this.shifts[s].volunteer_shifts[vs].waitlist) {
            this.waitlistList.push(this.shifts[s].volunteer_shifts[vs]);
          }
        }
      }
    },

    nonprofits() {
      this.nonprofitsList = [];

      /*
      All Nonprofits and attending Nonprofits are different object types (Nonprofit and Nonprfit Shifts).... so make the Nonprofit look similar to the Nonprofits Shift object by adding a nested non_profit property.
      */
      for (let i = 0; i < this.nonprofits.length; i++) {
        let newItem = {
          id: this.nonprofits[i].id,
          non_profit: { name: this.nonprofits[i].name },
        };
        this.nonprofitsList.push(newItem);
      }

      //remove items from the list of Nonprofits that are already attending
      this.removeDuplicates(this.attendingNonprofitsList, this.nonprofitsList);
    },

    nonprofitShifts() {
      this.attendingNonprofitsList = this.shift.non_profit_shifts;
    },

    volunteerShifts() {
      this.waitlistList = this.shift.volunteerShifts.filter((obj) => {
        return obj.waitlist == 1;
      });

      this.declinedList = this.shift.volunteerShifts.filter((obj) => {
        return obj.declined == 1;
      });

      this.pendingList = this.shift.volunteerShifts.filter((obj) => {
        return obj.pending == 1;
      });
    },
  },

  mounted() {
    this.attendingNonprofitsList = this.shift.non_profit_shifts;

    /*
      All Nonprofits and attending Nonprofits are different object types (Nonprofit and Nonprfit Shifts).... so make the Nonprofit look similar to the Nonprofits Shift object by adding a nested non_profit property.
      */
    for (let i = 0; i < this.nonprofits.length; i++) {
      let newItem = {
        id: this.nonprofits[i].id,
        non_profit: { name: this.nonprofits[i].name },
      };
      this.nonprofitsList.push(newItem);
    }
  },
};
</script>

<style scoped>
.tab {
  height: 95px !important;
  display: flex;
  align-items: center;
}
.tab__text {
  color: #fff !important;
  font-weight: 700 !important;
}
.tab-declined {
  background-color: #dc3036;
  border: 1px solid #dc3036 !important;
}
.tab-pending {
  background-color: #3f51b5;
  border: 1px solid #3f51b5 !important;
}
.tab-accepted {
  background-color: #2196f3;
  border: 1px solid #2196f3 !important;
}
.tab-waitlisted {
  background-color: #009688;
  border: 1px solid #009688 !important;
}
.tab-nonprofits {
  background-color: #4caf50;
  border: 1px solid #4caf50 !important;
}

.subheading {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.card-text {
  font-size: 1rem;
}

.tab-active .subheading,
.tab-active .card-text {
  color: #fff !important;
}

.tab-not-active {
  background-color: transparent;
}

.tab-number {
  font-weight: 700;
}
.list-header {
  padding: 1rem;
  margin-bottom: 1rem;
  color: #fff;
  font-weight: 700;
}

.list-header--accepted {
  background: #2196f3;
}

.list-header--waitlist {
  background: #009688;
}

.list-header--pending {
  background: #3f51b5;
}

.list-header--declined {
  background: #dc3036;
}

.list-header--npAttending {
  background: #4caf50;
}

.list-header--npAll {
  background: #009688;
}

.name-card {
  margin: 0.5rem auto;
}

.v-card--link:before {
  background: #fff !important;
}

.new-volunteer svg {
  width: 35px;
  height: 35px;
  color: #757575;
}
.new-volunteer-fill {
  fill: #757575;
}
.schedule-items-list {
  list-style: none;
  padding-left: 0 !important;
}
.schedule-items-list li {
  margin-bottom: 1rem !important;
}
.schedule-items-list li:last-child {
  margin-bottom: 0 !important;
}
.new-volunteer svg {
  width: 35px;
  height: 35px;
  color: #757575;
}
.new-volunteer-fill {
  fill: #757575;
}
.teams {
  display: flex;
  flex-grow: 1;
}

.list-header {
  display: flex;
  justify-content: space-between;
}
.capitalize {
  text-transform: uppercase;
}
</style>
