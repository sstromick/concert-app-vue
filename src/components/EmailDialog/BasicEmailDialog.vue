<template>
  <v-dialog v-model="activeStatus" max-width="700">
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
        <v-card-text class="pa-8">
          <v-text-field
            v-model="to"
            label="To"
            hide-details
            :rules="[(v) => /.+@.+/.test(v) || 'E-mail must be valid']"
          ></v-text-field>
          <v-text-field
            v-model="formData.subject"
            label="Subject"
            hide-details
            :rules="[(v) => !!v || 'required']"
          ></v-text-field>
          <v-textarea
            v-model="formData.body"
            label="Message"
            hide-details
            :rules="[(v) => !!v || 'required']"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            class="mt-5 align-self-end"
            @click="activeStatus = false"
          >
            Cancel
          </v-btn>
          <v-btn
            depressed
            color="primary"
            class="btn-primary mt-5 align-self-end"
            @click="submit"
          >
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "BasicEmailDialog",
  props: {
    active: Boolean,
    to: String,
  },
  data() {
    return {
      valid: false,
      source: [],
      emailsError: false,
      formData: {
        subject: null,
        body: null,
        addresses: [],
      },
    };
  },

  computed: {
    activeStatus: {
      get() {
        /* eslint-disable */
        return this.active;
      },
      set() {
        this.$emit("close");
      },
    },
  },

  watch: {
    to() {
      //this.formData.to = this.to;
    },
  },

  methods: {
    submit() {
      this.formData.addresses = [];
      this.formData.addresses.push({ email: this.to });
      if (this.$refs.form.validate()) {
        this.$store.dispatch("emails/sendEmails", this.formData);
        this.$refs.form.resetValidation();
        this.$emit("close");
      }
    },

    closeDialog() {
      this.$emit("close");
    },
  },

  mounted() {},
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
</style>
