<template>
  <v-container fluid v-if="user">
    <v-toolbar flat class="grey lighten-4 mb-8">
      <v-toolbar-title>{{ user.email }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text @click="$router.go(-1)" exact>Back</v-btn>
        <v-btn text @click="notesDialog = true">Notes</v-btn>
        <v-btn text @click="tagsDialog = true">Tags</v-btn>
        <v-btn icon @click="viewOnly = !viewOnly"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <v-btn icon @click="deleteDialog = true"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
      </v-toolbar-items>
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" class="hidden-md-and-up">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title
              ><a @click="$router.go(-1)" href="#">Back</a></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a @click="notesDialog = true" href="#"
                >Notes</a
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a @click="tagsDialog = true" href="#"
                >Tags</a
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a @click="deleteDialog = true" href="#"
                >Delete</a
              ></v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
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
              v-model="user.first_name"
              label="First Name"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="user.last_name"
              label="Last Name"
              :rules="[(v) => !!v || 'required']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              type="password"
              v-model="user.password"
              label="Password (to reset your current password)"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="user.email"
              label="Email"
              :rules="[(v) => /.+@.+/.test(v) || 'E-mail must be valid']"
              :disabled="viewOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs12>
            <v-switch
              v-model="user.active"
              :disabled="viewOnly"
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
      redirect="Users"
      :itemId="user.id"
      path="users/deleteUser"
      @close="deleteDialog = false"
    />
    <NotesDialog
      :active="notesDialog"
      :noteableId="user.id"
      noteableType="User"
      @close="notesDialog = false"
    ></NotesDialog>
    <TagsDialog
      :active="tagsDialog"
      :tagableId="user.id"
      tagableType="User"
      @close="tagsDialog = false"
    ></TagsDialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DeleteDialog from "@/components/DeleteDialog";
import NotesDialog from "@/components/Note/NotesDialog";
import TagsDialog from "@/components/Tag/TagsDialog";

export default {
  name: "UserShow",
  components: {
    DeleteDialog,
    NotesDialog,
    TagsDialog,
  },
  data: () => ({
    viewOnly: true,
    valid: false,
    deleteDialog: false,
    notesDialog: false,
    tagsDialog: false,
  }),
  computed: {
    ...mapGetters({
      user: "users/user",
    }),
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("users/updateUser", this.user);
      }
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("users/getUser", this.$route.params.id);
    },
  },
  mounted() {
    this.$store.dispatch("users/getUser", this.$route.params.id);
  },
};
</script>
