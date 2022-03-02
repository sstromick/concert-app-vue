<template>
  <v-container fluid>
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>New Metric</v-toolbar-title>
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
              v-model="formData.name"
              :rules="[(v) => !!v || 'required']"
              label="Name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="formData.metric_type"
              :items="metricTypes"
              label="Metric Level"
              item-text="name"
              item-value="id"
              auto-select-first
              :allow-overflow="false"
              :rules="[(v) => !!v || 'required']"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="formData.active" label="Active"></v-switch>
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
  name: "MetricNew",
  data: () => ({
    valid: false,
    formData: {
      name: "",
      metric_type: "",
      active: true,
    },
    metricTypes: ["Event", "Shift"],
  }),
  computed: {
    ...mapGetters({
      setting: "metrics/metric",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("metrics/createMetric", this.formData);
      }
    },
  },
  mounted() {},
};
</script>
