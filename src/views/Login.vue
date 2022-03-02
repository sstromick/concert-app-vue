<template>
  <v-layout align-center justify-center style="background-color: #fafafa">
    <v-flex xs12 sm6>
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login to Reverb</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="email"
              label="Email"
              prepend-icon="mdi-account"
              type="text"
              :rules="emailRules"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              prepend-icon="mdi-lock"
              type="password"
              :rules="passwordRules"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mb-3" block color="primary" @click="submit"
            >Login</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
  computed: {},
  mounted() {},
  methods: {
    ...mapActions({
      login: "auth/login",
    }),
    submit() {
      if (this.$refs.form.validate()) {
        this.login({ email: this.email, password: this.password }).then(() => {
          this.$router.replace({ name: "Home" });
        });
      }
    },
  },
};
</script>
