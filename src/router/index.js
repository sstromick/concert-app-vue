import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
  },
  {
    path: "/events",
    name: "Events",
    component: () =>
      import(/* webpackChunkName: "Events" */ "../views/Events/Index.vue"),
  },
  {
    path: "/events?filter=:filter",
    name: "EventsFilter",
    component: () =>
      import(/* webpackChunkName: "Events" */ "../views/Events/Index.vue"),
  },
  {
    path: "/event/:id",
    name: "EventShow",
    component: () =>
      import(/* webpackChunkName: "EventShow" */ "../views/Events/Show.vue"),
  },
  {
    path: "/events/new",
    name: "EventNew",
    component: () =>
      import(/* webpackChunkName: "EventNew" */ "../views/Events/New.vue"),
  },
  {
    path: "/events/:id/AddVolunteer",
    name: "EventAddVolunteer",
    component: () =>
      import(
        /* webpackChunkName: "EventNew" */ "../views/Events/AddVolunteer.vue"
      ),
  },
  {
    path: "/events/:id/AddTeamVolunteer",
    name: "EventAddTeamVolunteer",
    component: () =>
      import(
        /* webpackChunkName: "EventNew" */ "../views/Events/AddTeamVolunteer.vue"
      ),
  },
  {
    path: "/events/:id/Shifts",
    name: "EventShifts",
    component: () =>
      import(
        /* webpackChunkName: "EventShifts" */ "../views/Events/Shifts.vue"
      ),
  },
  {
    path: "/events/:id/email-templates",
    name: "EventEmailTemplates",
    component: () =>
      import(
        /* webpackChunkName: "ShiftShow" */ "../views/Events/EmailTemplates.vue"
      ),
  },
  {
    path: "/events/pending-volunteers",
    name: "EventsPendingVolunteers",
    component: () =>
      import(
        /* webpackChunkName: "Events" */ "../views/Events/PendingVolunteers.vue"
      ),
  },
  {
    path: "/volunteers",
    name: "VolunteersIndex",
    component: () =>
      import(
        /* webpackChunkName: "VolunteersIndex" */ "../views/Volunteers/Index.vue"
      ),
  },
  {
    path: "/volunteers?filter=:filter",
    name: "VolunteersIndexFilter",
    component: () =>
      import(
        /* webpackChunkName: "VolunteersIndex" */ "../views/Volunteers/Index.vue"
      ),
  },
  {
    path: "/volunteer/:id",
    name: "VolunteerShow",
    component: () =>
      import(
        /* webpackChunkName: "VolunteerShow" */ "../views/Volunteers/Show.vue"
      ),
  },
  {
    path: "/volunteers/new",
    name: "VolunteerNew",
    component: () =>
      import(
        /* webpackChunkName: "VolunteertNew" */ "../views/Volunteers/New.vue"
      ),
  },
  {
    path: "/volunteer/:id/notes",
    name: "VolunteerNotes",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/notes",
    name: "NotesIndex",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/event/:id/notes",
    name: "EventNotes",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/events/:id/shifts/new",
    name: "ShiftNew",
    component: () =>
      import(/* webpackChunkName: "ShiftNew" */ "../views/Shifts/New.vue"),
  },
  {
    path: "/shift/:id/notes",
    name: "ShiftNotes",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/nonprofits",
    name: "NonprofitsIndex",
    component: () =>
      import(
        /* webpackChunkName: "NonprofitsIndex" */ "../views/Nonprofits/Index.vue"
      ),
  },
  {
    path: "/nonprofit/:id",
    name: "NonprofitShow",
    component: () =>
      import(
        /* webpackChunkName: "NonprofitShow" */ "../views/Nonprofits/Show.vue"
      ),
  },
  {
    path: "/nonprofit/:id/notes",
    name: "NonprofitNotes",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/nonprofits/new",
    name: "NonprofitNew",
    component: () =>
      import(
        /* webpackChunkName: "NonprofitNew" */ "../views/Nonprofits/New.vue"
      ),
  },
  {
    path: "/shifts",
    name: "ShiftsIndex",
    component: () =>
      import(/* webpackChunkName: "ShiftsIndex" */ "../views/Shifts/Index.vue"),
  },
  {
    path: "/shifts?filter=:filter",
    name: "Shifts",
    component: () =>
      import(/* webpackChunkName: "Shifts" */ "../views/Shifts/Index.vue"),
  },
  {
    path: "/events/:id/shift/:shift_id",
    name: "ShiftShow",
    component: () =>
      import(/* webpackChunkName: "ShiftShow" */ "../views/Shifts/Show.vue"),
  },
  {
    path: "/events/:id/shift/:shift_id/email-templates",
    name: "ShiftEmailTemplates",
    component: () =>
      import(
        /* webpackChunkName: "ShiftShow" */ "../views/Shifts/EmailTemplates.vue"
      ),
  },
  {
    path: "/shift-update/:id",
    name: "ShiftSettings",
    component: () =>
      import(
        /* webpackChunkName: "ShiftShow" */ "../views/Shifts/Settings.vue"
      ),
  },
  {
    path: "/emails",
    name: "EmailsIndex",
    component: () =>
      import(/* webpackChunkName: "EmailsIndex" */ "../views/Emails/Index.vue"),
  },
  {
    path: "/email/:id",
    name: "EmailShow",
    component: () =>
      import(/* webpackChunkName: "EmailShow" */ "../views/Emails/Show.vue"),
  },
  {
    path: "/email/:id/notes",
    name: "EmailNotes",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/email-templates",
    name: "EmailTemplatesIndex",
    component: () =>
      import(
        /* webpackChunkName: "EmailTemplatesIndex" */ "../views/Email_Templates/Index.vue"
      ),
  },
  {
    path: "/email-template/:id",
    name: "EmailTemplateShow",
    component: () =>
      import(
        /* webpackChunkName: "EmailTemplateShow" */ "../views/Email_Templates/Show.vue"
      ),
  },
  {
    path: "/email-templates/:id/notes",
    name: "EmailTemplateNotes",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/contacts/new",
    name: "ContactNew",
    component: () =>
      import(/* webpackChunkName: "ContactNew" */ "../views/Contacts/New.vue"),
  },
  {
    path: "/contact/:id",
    name: "ContactShow",
    component: () =>
      import(
        /* webpackChunkName: "ContactShow" */ "../views/Contacts/Show.vue"
      ),
  },
  {
    path: "/contact/:id/notes",
    name: "ContactNotes",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/contacts",
    name: "ContactsIndex",
    component: () =>
      import(
        /* webpackChunkName: "ContactsIndex" */ "../views/Contacts/Index.vue"
      ),
  },
  {
    path: "/settings/new",
    name: "SettingNew",
    component: () =>
      import(/* webpackChunkName: "SettingNew" */ "../views/Settings/New.vue"),
  },
  {
    path: "/settings/:id",
    name: "SettingShow",
    component: () =>
      import(
        /* webpackChunkName: "SettingShow" */ "../views/Settings/Show.vue"
      ),
  },
  {
    path: "/settings",
    name: "SettingsIndex",
    component: () =>
      import(
        /* webpackChunkName: "SettingsIndex" */ "../views/Settings/Index.vue"
      ),
  },
  {
    path: "/reports",
    name: "Reports",
    component: () =>
      import(/* webpackChunkName: "Reports" */ "../views/Reports/Index.vue"),
  },
  // {
  //   path: "/reports?event_id=:event_id",
  //   name: "Reports",
  //   component: () =>
  //     import(/* webpackChunkName: "Reports" */ "../views/Reports/Index.vue"),
  // },
  // {
  //   path: "/reports?event_id=:event_id&shift_id=:shift_id",
  //   name: "Reports",
  //   component: () =>
  //     import(/* webpackChunkName: "Reports" */ "../views/Reports/Index.vue"),
  // },
  {
    path: "/users",
    name: "UsersIndex",
    component: () =>
      import(/* webpackChunkName: "UsersIndex" */ "../views/Users/Index.vue"),
  },
  {
    path: "/user/:id",
    name: "UserShow",
    component: () =>
      import(/* webpackChunkName: "UserShow" */ "../views/Users/Show.vue"),
  },
  {
    path: "/user/:id/notes",
    name: "UserNotes",
    component: () =>
      import(/* webpackChunkName: "NotesIndex" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/users/new",
    name: "UserNew",
    component: () =>
      import(/* webpackChunkName: "UserNew" */ "../views/Users/New.vue"),
  },
  {
    path: "/artists/new",
    name: "ArtistNew",
    component: () =>
      import(/* webpackChunkName: "ArtistNew" */ "../views/Artists/New.vue"),
  },
  {
    path: "/artist/:id",
    name: "ArtistShow",
    component: () =>
      import(/* webpackChunkName: "ArtistShow" */ "../views/Artists/Show.vue"),
  },
  {
    path: "/artist/:id/notes",
    name: "ArtistNotes",
    component: () =>
      import(/* webpackChunkName: "ArtistNotes" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/artists",
    name: "ArtistsIndex",
    component: () =>
      import(
        /* webpackChunkName: "ArtistsIndex" */ "../views/Artists/Index.vue"
      ),
  },
  {
    path: "/venues/new",
    name: "VenueNew",
    component: () =>
      import(/* webpackChunkName: "VenueNew" */ "../views/Venues/New.vue"),
  },
  {
    path: "/venue/:id",
    name: "VenueShow",
    component: () =>
      import(/* webpackChunkName: "VenueShow" */ "../views/Venues/Show.vue"),
  },
  {
    path: "/venue/:id/notes",
    name: "VenueNotes",
    component: () =>
      import(/* webpackChunkName: "VenueNotes" */ "../views/Notes/Index.vue"),
  },
  {
    path: "/venues",
    name: "VenuesIndex",
    component: () =>
      import(/* webpackChunkName: "VenuesIndex" */ "../views/Venues/Index.vue"),
  },
  {
    path: "/metrics/new",
    name: "MetricNew",
    component: () =>
      import(/* webpackChunkName: "MetricNew" */ "../views/Metrics/New.vue"),
  },
  {
    path: "/metrics/:id",
    name: "MetricShow",
    component: () =>
      import(/* webpackChunkName: "MetricShow" */ "../views/Metrics/Show.vue"),
  },
  {
    path: "/metrics",
    name: "MetricsIndex",
    component: () =>
      import(
        /* webpackChunkName: "MetricsIndex" */ "../views/Metrics/Index.vue"
      ),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
