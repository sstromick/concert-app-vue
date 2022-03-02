<template>
  <v-container fluid>
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>New User</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text color="primary" @click="$router.go(-1)" exact>Back</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent="submit"
    >
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.first_name"
              label="First Name"
              :rules="[(v) => !!v || 'required']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.last_name"
              label="Last Name"
              :rules="[(v) => !!v || 'required']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.email"
              label="Email"
              :rules="[(v) => /.+@.+/.test(v) || 'E-mail must be valid']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.password"
              label="Password"
              :type="'password'"
              :rules="[(v) => !!v || 'required']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.confirm_password"
              label="Confirm Password"
              :type="'password'"
              :rules="[
                this.formData.password === this.formData.confirm_password ||
                  'Password must match',
              ]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-btn
      dark
      small
      fixed
      bottom
      right
      fab
      @click="submit"
      v-if="valid == true"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "UserNew",
  data: () => ({
    valid: false,
    formData: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  }),
  computed: {
    ...mapGetters({
      user: "users/user",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("users/createUser", this.formData);
      }
    },
  },
  mounted() {
  },
};
</script>
