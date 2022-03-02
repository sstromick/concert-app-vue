<template>
  <v-container fluid v-if="metric">
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>{{ metric.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text color="primary" @click="$router.go(-1)" exact>Back</v-btn>
        <v-btn icon @click="viewOnly = !viewOnly"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <v-btn icon @click="deleteDialog = true"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
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
          <v-col cols="12">
            <v-text-field
              v-model="metric.name"
              label="Name"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-model="metric.metric_type"
              :items="metricTypes"
              label="Metric Level"
              auto-select-first
              :allow-overflow="false"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-switch
              :disabled="viewOnly"
              v-model="metric.active"
              label="Active"
            ></v-switch>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
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
    <DeleteDialog
      :active="deleteDialog"
      redirect="Metrics"
      :itemId="metric.id"
      path="metrics/deleteMetric"
      @close="deleteDialog = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DeleteDialog from "@/components/DeleteDialog";
export default {
  name: "MetricShow",
  components: {
    DeleteDialog,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    deleteDialog: false,
    metricTypes: ["Event", "Shift"],
  }),
  computed: {
    ...mapGetters({
      metric: "metrics/metric",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("metrics/updateMetric", this.metric);
      }
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("metrics/getMetric", this.$route.params.id);
    },
  },
  mounted() {
    this.$store.dispatch("metrics/getMetric", this.$route.params.id);
  },
};
</script>
