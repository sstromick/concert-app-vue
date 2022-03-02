<template>
  <v-dialog v-model="activeStatus" max-width="700">
    <v-form ref="form" v-on:submit.prevent="submit">
      <v-card>
        <v-toolbar flat class="grey lighten-4 mb-4">
          <v-toolbar-title v-if="name">Update Contact</v-toolbar-title>
          <v-toolbar-title v-else>Add Contact</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon color="primary" @click="activeStatus = false"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                label="Name"
                hide-details
                :rules="[(v) => !!v || 'required']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="title"
                label="Title"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                label="Email"
                hide-details
                :rules="[(v) => /.+@.+/.test(v) || 'E-mail must be valid']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="phone"
                label="Phone"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-btn
                class="white--text"
                color="green"
                depressed
                block
                @click="submit"
                >Save</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "ContactDialog",
  props: {
    id: Number,
    name: String,
    title: String,
    email: String,
    phone: String,
    active: Boolean,
    contactableId: Number,
    contactableType: String,
    addMode: Boolean,
  },
  data() {
    return {
      formData: {
        id: null,
        contactable_id: null,
        contactable_type: null,
        name: null,
        title: null,
        email: null,
        phone: null,
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
  methods: {
    submit() {
      this.formData.contactable_id = this.contactableId;
      this.formData.contactable_type = this.contactableType;
      this.formData.name = this.name;
      this.formData.title = this.title;
      this.formData.email = this.email;
      this.formData.phone = this.phone;

      if (this.$refs.form.validate()) {
        if (this.addMode) {
          this.$store.dispatch("contacts/createContact", this.formData, {
            name: this.$router.currentRoute.name,
            id: this.contactableId,
          });
        } else {
          this.formData.id = this.id;
          this.$store.dispatch("contacts/updateContact", this.formData, {
            name: this.$router.currentRoute.name,
            id: this.contactableId,
          });
        }
        this.activeStatus = false;
      }
    },
  },
  watch: {},
};
</script>
