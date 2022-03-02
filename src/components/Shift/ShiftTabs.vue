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
              {{ acceptedList.length }}
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
    <v-row v-if="shift.volunteer_shifts">
      <v-col v-if="acceptedListVisible">
        <div class="list-header list-header--accepted">
          <h4>Accepted</h4>
        </div>
        <draggable
          :list="acceptedList"
          group="people"
          ghostClass="ghost"
          @change="volunteerShiftsHaveUpdates = true"
        >
          <div v-for="item in filteredAcceptedList" :key="item.id">
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
          <h4>Waitlisted</h4>
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
  </v-flex>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "ShiftTabs",

  components: {
    draggable,
  },

  props: {
    shift: Object,
    nonprofits: Array,
  },

  data() {
    return {
      search: "",
      searchLabel: "Search Volunteers",
      acceptedList: [],
      waitlistList: [],
      declinedList: [],
      pendingList: [],
      nonprofitsList: [],
      attendingNonprofitsList: [],

      acceptedListVisible: true,
      waitlistListVisible: true,
      declinedListVisible: false,
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

    filteredAcceptedList: function() {
      return this.acceptedList.filter((item) => {
        let str = new RegExp(this.search, "i");
        return (
          item.volunteer &&
          (item.volunteer.first_name.match(str) ||
            item.volunteer.last_name.match(str))
        );
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
      this.npAttendingVisible = true;
      this.npAllVisible = true;
      this.acceptedListVisible = false;
      this.waitlistListVisible = false;
      this.declinedListVisible = false;
      this.pendingListVisible = false;
      this.searchLabel = "Search Nonprofits";
    },

    toglePendingTab: function() {
      this.pendingListVisible = !this.pendingListVisible;
      this.hideNonProfitTabs();
    },

    togleDeclinedTab: function() {
      this.declinedListVisible = !this.declinedListVisible;
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
      this.$store.dispatch("global/updateLoading", true, { root: true });

      //clear arrays about to be added to
      this.volunteerShiftData.accepted_ids.splice(
        0,
        this.volunteerShiftData.accepted_ids.length
      );
      this.volunteerShiftData.declined_ids.splice(
        0,
        this.volunteerShiftData.declined_ids.length
      );
      this.volunteerShiftData.pending_ids.splice(
        0,
        this.volunteerShiftData.pending_ids.length
      );
      this.volunteerShiftData.waitlist_ids.splice(
        0,
        this.volunteerShiftData.waitlist_ids.length
      );

      //Volunteer Updates
      if (this.volunteerShiftsHaveUpdates) {
        for (let i = 0; i < this.acceptedList.length; i++)
          this.volunteerShiftData.accepted_ids.push({
            id: this.acceptedList[i].id,
          });

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

    shift() {
      this.acceptedList = this.shift.volunteer_shifts.filter((obj) => {
        return obj.accepted == 1;
      });

      this.waitlistList = this.shift.volunteer_shifts.filter((obj) => {
        return obj.waitlist == 1;
      });

      this.declinedList = this.shift.volunteer_shifts.filter((obj) => {
        return obj.declined == 1;
      });

      this.pendingList = this.shift.volunteer_shifts.filter((obj) => {
        return obj.pending == 1;
      });
    },

    volunteerShifts() {
      this.acceptedList = this.shift.volunteer_shifts.filter((obj) => {
        return obj.accepted == 1;
      });

      this.waitlistList = this.shift.volunteer_shifts.filter((obj) => {
        return obj.waitlist == 1;
      });

      this.declinedList = this.shift.volunteer_shifts.filter((obj) => {
        return obj.declined == 1;
      });

      this.pendingList = this.shift.volunteer_shifts.filter((obj) => {
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

    this.acceptedList = this.shift.volunteer_shifts.filter((obj) => {
      return obj.accepted == 1;
    });

    this.waitlistList = this.shift.volunteer_shifts.filter((obj) => {
      return obj.waitlist == 1;
    });

    this.declinedList = this.shift.volunteer_shifts.filter((obj) => {
      return obj.declined == 1;
    });

    this.pendingList = this.shift.volunteer_shifts.filter((obj) => {
      return obj.pending == 1;
    });
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
.tab-pending {
  background-color: #3f51b5;
  border: 1px solid #3f51b5 !important;
}
.tab-declined {
  background-color: #dc3036;
  border: 1px solid #dc3036 !important;
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

.list-header--declined {
  background: #dc3036;
}

.list-header--pending {
  background: #3f51b5;
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
</style>
