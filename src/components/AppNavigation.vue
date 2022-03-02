<template>
  <div>
    <v-app-bar dark color="primary">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <router-link to="/"
        ><v-img
          class="mx-2"
          src="@/assets/logo.png"
          max-height="40"
          max-width="40"
        ></v-img
      ></router-link>

      <nav class="mx-4">
        <router-link :to="{ name: 'Events' }">Events</router-link>
        <router-link to="/volunteers">Volunteers</router-link>
        <router-link to="/Contacts">Contacts</router-link>
        <router-link to="/reports">Reports</router-link>
      </nav>

      <v-spacer></v-spacer>
      <div>
        <v-text-field
          v-model="searchTerm"
          light
          solo
          hide-details
          append-icon="mdi-magnify"
          placeholder="Search..."
          class="nav-search"
          v-on:keyup.enter="onEnter"
        >
        </v-text-field>
      </div>
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <router-link :to="{ name: 'EventNew' }">
              <v-list-item-title>Create Event</v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item>
            <router-link :to="{ name: 'VolunteerNew' }">
              <v-list-item-title>Create Volunteer</v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item>
            <router-link :to="{ name: 'VenueNew' }">
              <v-list-item-title>Create Venue</v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item>
            <router-link :to="{ name: 'NonprofitNew' }">
              <v-list-item-title>Create Nonprofit</v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item>
            <router-link :to="{ name: 'ArtistNew' }">
              <v-list-item-title>Create Artist</v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item>
            <router-link :to="{ name: 'ContactNew' }">
              <v-list-item-title>Create Contact</v-list-item-title>
            </router-link>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item :to="{ name: 'Home' }">
            <v-list-item-icon>
              <v-icon>mdi-antenna</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-music-note</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link :to="{ name: 'ArtistsIndex' }">Artists</router-link>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link :to="{ name: 'VenuesIndex' }">Venues</router-link>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link :to="{ name: 'NonprofitsIndex' }"
                >Nonprofits</router-link
              >
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link :to="{ name: 'EmailsIndex' }">Emails</router-link>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link :to="{ name: 'UsersIndex' }">Users</router-link>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-settings</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link :to="{ name: 'SettingsIndex' }"
                >Settings</router-link
              >
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    searchTerm: "",
  }),
  methods: {
    onEnter: function() {
      this.$emit("search", this.searchTerm);
      this.searchTerm = "";
    },
  },
};
</script>

<style>
nav a {
  color: white !important;
  text-decoration: none;
  margin-right: 2rem;
}
.nav-search.v-input .v-input__slot {
  background: transparent !important;
  box-shadow: none !important;
  border: 0.5px solid #ffffff80;
  border-radius: 3px;
  color: #fff;
}

.nav-search input::placeholder {
  color: #fff !important;
  opacity: 0.5;
}
.nav-search .v-icon.v-icon {
  color: #fff;
}

.router-link-active {
  font-weight: 600 !important;
}
</style>
