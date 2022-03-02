<template>
  <v-dialog v-model="activeStatus" max-width="80%">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent="submit"
    >
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Send Email
      </v-card-title>
      <v-card-text v-if="volunteerShifts" class="py-0">
        <v-row>
          <v-col class="left-side" cols="7">
             <v-row>
              <div class="d-flex flex-row flex-grow-1">
                <v-autocomplete
                  v-model="formData.volunteerShift"
                  :items="volunteerShifts"
                  :item-text="(item) => `${item.volunteer.first_name} ${item.volunteer.last_name}`"
                  label="Volunteer Name"
                  :return-object="true"
                ></v-autocomplete>
                <v-btn
                  depressed
                  color="primary"
                  class="btn-primary ml-6 my-auto"
                  @click="addVolunteer()"
                >
                  Add
                </v-btn>
              </div>
            </v-row>
            <v-row>
              <v-checkbox
                v-model="formData.accepted"
                v-on:change="acceptedClicked()"
                class="mx-2"
                label="Accepted"
              ></v-checkbox>
              <v-checkbox
                v-model="formData.waitlisted"
                v-on:change="waitlistedClicked()"
                class="mx-2"
                label="Waitlisted"
              ></v-checkbox>
              <v-checkbox
                v-model="formData.declined"
                v-on:change="declinedClicked()"
                class="mx-2"
                label="Declined"
              ></v-checkbox>
            </v-row>

            <v-row>
              <v-autocomplete
                v-model="formData.template"
                :items="emailTemplates"
                item-text="subject"
                item-value="id"
                label="Optional Template"
                @change="templateChanged()"
              ></v-autocomplete>
            </v-row>

            <v-row>
              <v-text-field
                v-model="formData.subject"
                label="Subject"
                hide-details
                :rules="[(v) => !!v || 'required']"
              ></v-text-field>
            </v-row>

            <v-row>
              <v-textarea
                v-model="formData.body"
                label="Message"
                hide-details
                :rules="[(v) => !!v || 'required']"
              ></v-textarea>
            </v-row>
          </v-col>

          <v-col class="right-side" cols="5">
            <div class="flex flex-column email-recipients">
              <h4>Recipients</h4>
              <p class="red--text" v-if="emailsError">
                At least one email recipient is required
              </p>
              <ul>
                <li v-for="(item, index) in formData.addresses" :key="item.email">
                  <v-icon v-on:click="removeEmail(index)"
                    >mdi-close-circle-outline</v-icon
                  >
                  {{ item.email }}
                </li>
              </ul>
            </div>
            <div class="d-flex flex-row">
              <v-text-field
                v-model="formData.email"
                label="Email"
                hide-details
              ></v-text-field>
              <v-btn
                depressed
                @click="addEmail()"
                class="btn-primary align-self-end"
              >
                Add
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn
          depressed
          class="mt-5 mr-2 align-self-end"
          @click="activeStatus = false"
        >
          Cancel
        </v-btn>
        <v-btn
          depressed
          class="btn-primary mt-5 align-self-end"
          @click="submit"
          v-if="valid == true"
        >
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "EmailDialog",
  props: {
    active: Boolean,
    shiftId: Number,
    eventId: Number,
  },
  data() {
    return {
      valid: false,
      source: [],
      emailsError: false,
      formData: {
        volunteerShift: null,
        templates: null,
        accepted: false,
        waitlisted: false,
        declined: false,
        subject: null,
        body: null,
        addresses: [],
      },
    };
  },

  computed: {
    ...mapGetters({
      volunteerShifts: "volunteer_shifts/volunteer_shifts",
      emailTemplates: "email_templates/email_templates",
    }),

    activeStatus: {
      get() {
        /* eslint-disable */
        if (this.active) {
          this.formData.volunteerShift = null;
          this.formData.templates = null;
          this.formData.accepted = false;
          this.formData.waitlisted = false;
          this.formData.declined = false;
          this.formData.subject = null;
          this.formData.body = null;
          this.formData.addresses = [];
        }

        return this.active;
      },
      set() {
        this.$emit("close");
      },
    },
  },

  methods: {
    templateChanged() {
      let template = this.emailTemplates.filter((obj) => {
        return obj.id === this.formData.template;
      });

      if (template.length) {
        this.formData.subject = template[0].subject;
        this.formData.body = template[0].body;
      }
    },

    addToEmailList(shifts) {
      for (let i = 0; i < shifts.length; i++) {
        let newEmail = { email: shifts[i].volunteer.email };
        this.formData.addresses.push(newEmail);
      }
    },

    removeFromEmailList(shifts) {
      for (let i = 0; i < shifts.length; i++) {
        for (let j = 0; j < this.formData.addresses.length; j++) {
          if (shifts[i].volunteer.email == this.formData.addresses[j].email) {
            this.formData.addresses.splice(j, 1);
          }
        }
      }
    },

    acceptedClicked() {
      let shifts = this.volunteerShifts.filter((obj) => {
        return obj.accepted === 1;
      });

      if (this.formData.accepted) {
        this.addToEmailList(shifts);
      } else {
        this.removeFromEmailList(shifts);
      }
    },

    waitlistedClicked() {
      let shifts = this.volunteerShifts.filter((obj) => {
        return obj.waitlist === 1;
      });

      if (this.formData.waitlisted) {
        this.addToEmailList(shifts);
      } else {
        this.removeFromEmailList(shifts);
      }
    },

    declinedClicked() {
      let shifts = this.volunteerShifts.filter((obj) => {
        return obj.declined === 1;
      });

      if (this.formData.declined) {
        this.addToEmailList(shifts);
      } else {
        this.removeFromEmailList(shifts);
      }
    },

    addVolunteer() {
      let newEmail = { email: this.formData.volunteerShift.volunteer.email };
      this.formData.addresses.push(newEmail);
      // this.formData.volunteer = null;
    },

    addEmail() {
      let newEmail = { email: this.formData.email };
      this.formData.addresses.push(newEmail);
      this.formData.email = null;
    },

    submit() {
      if (this.formData.addresses.length == 0) {
        this.emailsError = true;
      }

      if (this.$refs.form.validate() && this.formData.addresses.length > 0) {
        this.$store.dispatch("emails/sendEmails", this.formData);
        this.$refs.form.resetValidation();
        this.$emit("close");
      }
    },

    closeDialog() {
      this.$emit("close");
    },

    removeEmail(index) {
      this.formData.addresses.splice(index, 1);
    },
  },

  watch: {
    shiftId: function() {
      this.$store.dispatch(
        "volunteer_shifts/searchVolunteerShifts",
        "filter[shift_id]=" + this.shiftId
      );
    },
  },

  mounted() {
    this.$store.dispatch("email_templates/searchEmailTemplates", 'filter[event_id]=' + this.eventId);
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}

.left-side {
  background-color: #fafafa;
  padding: 1rem 4rem;
}

.right-side {
  padding: 3rem 2rem;
  background-color: #eeeeee;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.email-recipients {
  overflow-y: scroll;
  max-height: 300px;
}
.email-recipients ul {
  padding: 0;
}
</style>
