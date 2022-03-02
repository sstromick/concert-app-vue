import Vue from "vue";
import Vuex from "vuex";
import globalModule from "./modules/global";
import eventsModule from "./modules/events";
import contactsModule from "./modules/contacts";
import artistsModule from "./modules/artists";
import venuesModule from "./modules/venues";
import nonprofitsModule from "./modules/nonprofits";
import volunteersModule from "./modules/volunteers";
import countriesModule from "./modules/countries";
import statesModule from "./modules/states";
import shiftsModule from "./modules/shifts";
import emailsModule from "./modules/emails";
import emailTemplatesModule from "./modules/email_templates";
import nonprofitShiftsModule from "./modules/nonprofit_shifts";
import volnteerShiftsModule from "./modules/volunteer_shifts";
import usersModule from "./modules/users";
import reportsModule from "./modules/reports";
import statsModule from "./modules/stats";
import notesModule from "./modules/notes";
import tagsModule from "./modules/tags";
import searchResultsModule from "./modules/search_results";
import settingsModule from "./modules/settings";
import metricsModule from "./modules/metrics";
import metricsValuesModule from "./modules/metric_values";
import contactMastersModule from "./modules/contact_masters";
import authModule from "./modules/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    global: globalModule,
    events: eventsModule,
    contacts: contactsModule,
    artists: artistsModule,
    venues: venuesModule,
    nonprofits: nonprofitsModule,
    volunteers: volunteersModule,
    countries: countriesModule,
    states: statesModule,
    shifts: shiftsModule,
    emails: emailsModule,
    email_templates: emailTemplatesModule,
    nonprofit_shifts: nonprofitShiftsModule,
    volunteer_shifts: volnteerShiftsModule,
    users: usersModule,
    reports: reportsModule,
    stats: statsModule,
    notes: notesModule,
    tags: tagsModule,
    search_results: searchResultsModule,
    settings: settingsModule,
    metrics: metricsModule,
    metric_values: metricsValuesModule,
    contact_masters: contactMastersModule,
    auth: authModule,
  },
});
