<template>
  <v-main>
    <v-card class="ma-0 pa-0 fill-height fill-width" :loading="loading">
      <v-container>
        <v-row justify="center">
          <v-card v-if="userProfileDetails !== null" :elevation="0" width="80%">
            <v-col justify="center">
              <div class="text-h3">Profile</div>
              <v-card class="pa-4">
                <v-row class="mx-2">
                  <v-col cols="6">
                    <div class="text-h6">Email:</div>
                  </v-col>
                  <v-col cols="6">{{userProfileDetails.email}}</v-col>
                </v-row>
              </v-card>
              <v-card class="pa-4">
                <div class="text-h4">Change password</div>
                <v-form
                  ref="changePasswordForm"
                  v-model="valid"
                  class="px-4"
                  lazy-validation
                  :disabled="loading"
                >
                  <v-text-field
                    v-model="oldPassword"
                    label="Old password"
                    :type="show1 ? 'text':'password'"
                    :rules="passwordRules"
                    outlined
                    required
                    class="mt-4"
                    :counter="20"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-text-field
                    v-model="newPassword"
                    label="New password"
                    :type="show2 ? 'text':'password'"
                    :rules="passwordRules"
                    outlined
                    :counter="20"
                    required
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show2 = !show2"
                  ></v-text-field>
                  <v-text-field
                    v-model="confirmPassword"
                    label="Re-enter new password"
                    :type="show3 ? 'text':'password'"
                    :rules="confirmPasswordRules"
                    outlined
                    :counter="20"
                    required
                    :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show3 = !show3"
                  ></v-text-field>

                  <v-btn
                    color="success"
                    :disabled="loading"
                    @click="triggerChangePassword"
                    width="100%"
                    height="50"
                  >Confirm change</v-btn>
                </v-form>
              </v-card>
            </v-col>
          </v-card>
        </v-row>
      </v-container>
    </v-card>
  </v-main>
</template>

<script>
export default {
  components: {},
  mounted() {
    this.$store.dispatch("profile/getUserProfile");
  },
  computed: {
    userProfileDetails() {
      return this.$store.state.profile.userProfileDetails;
    },
    loading() {
      return this.$store.state.global.loading;
    },
  },
  data() {
    return {
      valid: false,
      show1: false,
      show2: false,
      show3: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",

      passwordRules: [
        (v) => !!v || "It is required",
        (v) =>
          (!!v && v.length >= 6) ||
          "Password should be at least 6 characters long",
        (v) =>
          (!!v && v.length <= 20) ||
          "Password should not exceeds 20 characters",
      ],
      confirmPasswordRules: [
        (v) => !!v || "It is required",
        (v) => (!!v && v === this.newPassword) || "Password does not match",
      ],
    };
  },
  methods: {
    triggerChangePassword() {
      if (!this.$refs.changePasswordForm.validate()) return;
      this.$store.dispatch("profile/changePassword", {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      });
      this.$refs.changePasswordForm.reset();
    },
  },
};
</script>

<style>
</style>