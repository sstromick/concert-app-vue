<template>
  <v-container fluid v-if="shift">
    <ShiftHeader
      :shift="shift"
      :viewOnly="viewOnly"
      @updateShift="viewOnlyChanged"
      showShiftEditIcon="true"
    />

    <v-row class="mt-5">
      <v-autocomplete
        outlined
        v-model="emailType"
        :items="emailTemplates"
        item-text="event_type"
        item-value="id"
        label="Templates"
      ></v-autocomplete>
    </v-row>

    <div v-if="showEmailForm">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        v-on:submit.prevent="submit"
      >
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="formData.subject"
              label="Subject"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-textarea
            ref="textField"
            outlined
            v-model="formData.body"
            label="Body"
            :rules="[(v) => !!v || 'required']"
            :disabled="viewOnly"
          ></v-textarea>
        </v-row>
        <v-row>
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[FIRST NAME]')"
            class="button-token"
            >First Name</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[LAST NAME]')"
            class="button-token"
            >Last Name</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[EVENT]')"
            class="button-token"
            >Event</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[ARTIST]')"
            class="button-token"
            >Artist</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[SHIFT DATE]')"
            class="button-token"
            >Shift Date</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[VENUE NAME]')"
            class="button-token"
            >Venu Name</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[VENUE ADDRESS]')"
            class="button-token"
            >Venue Address</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[VENUE CITY STATE]')"
            class="button-token"
            >Venue City/State</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[VENUE LINK]')"
            class="button-token"
            >Venue Link</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[CHECK IN TIME]')"
            class="button-token"
            >Check In Time</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[CONTACT NAME]')"
            class="button-token"
            >Contact Name</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[CONTACT PHONE]')"
            class="button-token"
            >Contact Phone</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[CONTACT EMAIL]')"
            class="button-token"
            >Contact Email</v-btn
          >
          <v-btn
            :disabled="viewOnly"
            outlined
            @click="insertToken('[CONFIRMATION LINK]')"
            class="button-token"
            >Confirmation Link</v-btn
          >
        </v-row>
      </v-form>
    </div>
    <v-btn
      color="green"
      dark
      small
      fixed
      bottom
      right
      fab
      v-if="valid == true && !viewOnly"
      @click="submit"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ShiftHeader from "@/components/Shift/ShiftHeader";

export default {
  name: "ShiftEmailTemplates",
  components: {
    ShiftHeader,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    showEmailForm: false,
    emailType: null,

    formData: {
      event_id: null,
      shift_id: null,
      subject: null,
      body: null,
      event_type: "",
    },
  }),

  computed: {
    ...mapGetters({
      shift: "shifts/shift",
      shifts: "shifts/shifts",
      emailTemplates: "email_templates/email_templates",
    }),
  },

  methods: {
    viewOnlyChanged(value) {
      this.viewOnly = value;
    },
    editShiftChange() {
      this.viewOnly = !this.viewOnly;
      this.$emit("updateShift", this.viewOnly);
    },
    insertToken(token) {
      const el = this.$refs.textField.$el.querySelector("textarea");
      let cursorPos = el.selectionEnd;
      this.formData.body =
        this.formData.body.substring(0, cursorPos) +
        token +
        this.formData.body.substring(cursorPos);
      cursorPos += this.formData.body.length;
      this.$nextTick(() => el.setSelectionRange(cursorPos, cursorPos));
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.formData.event_id = this.shift.event.id;
        this.formData.shift_id = this.shift.id;

        this.$store.dispatch(
          "email_templates/createEmailTemplate",
          this.formData
        );
      }
    },
  },

  watch: {
    emailType() {
      for (let i = 0; i < this.emailTemplates.length; i++) {
        if (this.emailTemplates[i].id == this.emailType) {
          this.formData.event_type = this.emailTemplates[i].event_type;
          this.formData.subject = this.emailTemplates[i].subject;
          this.formData.body = this.emailTemplates[i].body;
          this.showEmailForm = true;
        }
      }
    },
    shift() {
      this.$store.dispatch(
        "shifts/searchShifts",
        "filter[event_id]=" + this.shift.event.id
      );
    },
  },

  mounted() {
    this.$store.dispatch("shifts/getShift", this.$route.params.shift_id);
    this.$store.dispatch(
      "email_templates/searchEmailTemplates",
      "filter[event_id]=" +
        this.shift.event.id +
        ",filter[shift_id]=" +
        this.shift.id
    );
  },
};
</script>

<style scoped>
.button-token {
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}
</style>
