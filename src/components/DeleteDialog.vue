<template>
  <v-dialog v-model="active" width="500">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Are you sure?</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        This will permanently delete this item and any associated data.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="deleteItem()">Confirm Delete</v-btn>
        <v-btn flat @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "DeleteDialog",
  props: {
    active: Boolean,
    path: String,
    itemId: Number,
    redirect: String,
    redirectParams: Object,
  },
  methods: {
    deleteItem() {
      this.$store.dispatch("global/updateLoading", true, { root: true });
      this.$store.dispatch(this.path, this.itemId);
      if (this.redirect) {
        this.$router.push({ name: this.redirect, params: this.redirectParams });
      }
      this.$emit("close");
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
