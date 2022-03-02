<template>
  <v-container fluid v-if="setting">
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>{{ setting.name }}</v-toolbar-title>
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
            <v-textarea
              v-model="setting.value"
              label="Value"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-textarea>
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
      redirect="Settings"
      :itemId="setting.id"
      path="settings/deleteSetting"
      @close="deleteDialog = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DeleteDialog from "@/components/DeleteDialog";
export default {
  name: "SettingShow",
  components: {
    DeleteDialog,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    deleteDialog: false,
  }),
  computed: {
    ...mapGetters({
      setting: "settings/setting",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("settings/updateSetting", this.setting);
      }
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("settings/getSetting", this.$route.params.id);
    },
  },
  mounted() {
    this.$store.dispatch("settings/getSetting", this.$route.params.id);
  },
};
</script>
