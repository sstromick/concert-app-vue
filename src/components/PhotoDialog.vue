<template>
  <v-dialog v-model="activeStatus" max-width="700">
    <v-card>
      <v-toolbar flat class="grey lighten-4 mb-4">
        <v-toolbar-title>Upload Photo</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon color="primary" @click="activeStatus = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            <input accept="image/*" type="file" ref="file" style="display:none" @change="onFileChange">
            <v-btn @click.native="openFileDialog">
              {{btnText}}
            </v-btn>
            <small v-if="fileName" class="mt-3 ml-3">{{fileName}}</small>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn class="white--text" color="green" depressed block v-if="showUpload" @click="submit">UPLOAD</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "PhotoDialog",
    props: {
      active: Boolean,
      photographableId: Number,
      photoUrl: String,
      uploadPhotoEndpoint: String
    },
    data() {
      return {
        formData: {
          id: null,
          photo_url: null
        },
        fileName: this.photoUrl,
        showUpload: false
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
      btnText: {
        get() {
          return this.photoUrl ? 'Change Photo' : 'Add Photo'
        },
        set(name) {
          return name
        }
      },
    },
    watch: {},
    methods: {
      openFileDialog() {
       this.$refs.file.click();
      },
      onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
          this.formData = new FormData()
          this.formData.append('photo_url', files[0])
          this.formData.append('id', this.photographableId)
          this.btnText = 'Change Photo'
          this.fileName = files[0].name
          this.showUpload = true
        }
      },
      submit () {
        this.$store.dispatch(this.uploadPhotoEndpoint, this.formData)
        this.$refs.file.value = ""
        this.btnText = 'Add Photo'
        this.fileName = null
        this.activeStatus = false
        this.showUpload = false
      },
    },
    watch: {
      active(val) {
        if (val) {
          this.showUpload = false
        } 
        this.fileName = this.photoUrl
      }
    }
  };
</script>
