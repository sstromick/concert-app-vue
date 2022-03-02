<template>
  <v-container fluid>
    <v-toolbar flat class="grey lighten-4">
      <v-toolbar-title>New Artist</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text @click="$router.go(-1)" exact>Back</v-btn>
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
              v-model="formData.name"
              :rules="[(v) => !!v || 'required']"
              label="Name"
              required
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
  name: "ArtistNew",
  data: () => ({
    valid: false,
    formData: {
      name: "",
    },
  }),
  computed: {
    ...mapGetters({
      artist: "artists/artist",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("artists/createArtist", this.formData);
      }
    },
  },
  mounted() {},
};
</script>
