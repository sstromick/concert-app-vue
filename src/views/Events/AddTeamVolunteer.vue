<template>
  <v-flex>
    <v-toolbar text flat class="grey lighten-4 mb-8">
      <v-toolbar-title>Volunteer For {{ event.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text color="primary" @click="$router.go(-1)">Back</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      v-on:submit.prevent="submit"
    >
      <v-container>
        <v-layout>
          <v-flex xs12>
            <p>
              Copy the code below and paste it onto your tour website to allow
              visitors to sign up.
            </p>
            <v-textarea
              auto-grow="true"
              outlined="outlined"
              v-model="buildFormData"
            >
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-flex>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "EventAddTeamVolunteer",
  data: () => ({
    valid: false,
  }),
  computed: {
    ...mapGetters({
      event: "events/event",
      states: "states/states",
      settings: "settings/settings",
    }),

    thankyouURL: function() {
      let url = "https://reverb.org";
      let setting = null;

      setting = this.settings.find(function(setting) {
        return setting.name === "thank-you-url";
      });

      if (setting) url = setting.value;

      return url;
    },

    buildFormData: function() {
      let options = "";

      /* eslint-disable */
      let startHTML =
        `<style type="text/css">
  #error {color:red;font-weight:700;display: none;}
  #rvb_signup li::before { content: none; }
</style>


<p id="error">An error has occured with the form submission</p>
<form accept-charset="utf-8" class="rvb_signup" id="rvb_signup">
<fieldset>
  <ul>
    <li><label for="first_name">First Name</label> <input required type="text" id="first_name" name="first_name" value=""  /></li>
    <li><label for="last_name">Last Name</label> <input required type="text" id="last_name" name="last_name" value=""  /></li>
    <li><label for="address_line_1">Address Line 1</label> <input type="text" id="address_line_1" name="address_line_1" value=""  /></li>
    <li><label for="address_line_2">Address Line 2</label> <input type="text" id="address_line_2" name="address_line_2" value=""  /></li>
    <li><label for="city">City</label> <input type="text" id="city" name="city" value=""  /></li>
    <li style="border:none;"><label for="state">State</label> <select id="state" name="state" style="width:380px;">
      ` +
        this.getStates() +
        `
    </select></li><li><label for="postal_code">Postal Code</label> <input type="text" id="postal_code" name="postal_code" value=""  /></li>
    <li><label for="email">Email</label> <input required type="text" id="email" name="email" value=""  /></li>
    <li><label for="phone">Phone Number</label> <input type="text" id="phone" name="phone" value="" onkeypress='validate(event)' /></li>
    <li><label for="gender">Gender</label> <select id="gender" name="gender">
<option value="M">Male</option>
<option value="F">Female</option>
</select></li>
    <li><label for="tshirt_size">T-Shirt Size</label> <select id="tshirt_size" name="tshirt_size">
<option value="xs">XS</option>
<option value="s">S</option>
<option value="m">M</option>
<option value="l">L</option>
<option value="xl">XL</option>
<option value="xsl">XXL</option>
</select></li>
<li><label for="note">Why would you like to volunteer for REVERB?</label> <textarea required id="note" name="note"></textarea> </li>
<li class="button"><input type="submit" name="" value="Submit Your Application!"  /></li>
  </ul>
</fieldset>
</form>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"><\/script>
<script>
  $("#rvb_signup").submit(function(e) {
      e.preventDefault();
      $.ajax({
          url     : '${process.env.VUE_APP_API_URL}/volunteershifts',
          async   : true,
          dataType: 'json',
          type    : 'POST',
          data    : {
               first_name: $("#first_name").val(),
               last_name: $("#last_name").val(),
               address_line_1: $("#address_line_1").val(),
               address_line_2: $("#address_line_2").val(),
               city: $("#city").val(),
               state_id: $("#state").val(),
               postal_code: $("#postal_code").val(),
               email: $("#email").val(),
               phone: $("#phone").val(),
               gender: $("#gender").val(),
               tshirt_size: $("#tshirt_size").val(),
               country_id: 1,
               event_id: ${this.event.id},
               shift_id: $("#shift_id").val(),
               note: $("#note").val(),
          }
      }).done(function() {
          window.location.replace('${this.thankyouURL}');
      }).fail(function(xhr, status, error) {
          $('#error').show();
      });
  });
<\/script>
<script type="text/javascript">
function validate(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}
<\/script>`;

      return startHTML + options;
    },
  },
  methods: {
    getStates() {
      let options = "";
      for (let i = 0; i < this.states.length; i++) {
        options +=
          '<option value="' +
          this.states[i].id +
          '">' +
          this.states[i].name +
          "</option>";
      }
      return options;
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("volunteers/createVolunteer", this.formData);
      }
    },
  },
  watch: {
    $route() {
      this.$store.dispatch("events/getEvent", this.$route.params.id);
    },
  },
  mounted() {
    this.$store.dispatch("events/getEvent", this.$route.params.id);
    this.$store.dispatch("states/getStates", this.$route.params.id);
    this.$store.dispatch("settings/getSettingsNoPaginate");
  },
};
</script>
