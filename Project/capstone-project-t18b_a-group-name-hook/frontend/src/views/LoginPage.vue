<template>
  <v-main>
    <v-card class="ma-0 pa-0 fill-height fill-width" :loading="loading">
      <v-container>
        <v-row class="ma-4" justify="center">
          <v-card :width="700" :elevation="0">
            <v-form
              ref="loginForm"
              v-model="valid"
              class="px-4"
              lazy-validation
              :disabled="loading"
            >
              <h1 class="mt-4">User Login / Register</h1>
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                :rules="emailRules"
                required
                class="mt-4"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                outlined
                :rules="passwordRules"
                :counter="20"
                required
                class
              ></v-text-field>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-btn
                    color="success"
                    @click="login"
                    width="100%"
                    height="50"
                    :disabled="loading"
                  >Login</v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-btn @click="register" width="100%" height="50" :disabled="loading">Register</v-btn>
                </v-col>
              </v-row>
            </v-form>
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
    this.$store.dispatch("profile/fallBackIfLogin")
  },
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      checkbox: false,
      emailRules: [
        (v) => !!v || "Email is required",
        (v) =>
          (!!v &&
            v.length > 0 &&
            !!v.match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) ||
          "Email format is invalid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (!!v && v.length >= 6) ||
          "Password should be at least 6 characters long",
        (v) =>
          (!!v && v.length <= 20) ||
          "Password should not exceeds 20 characters",
      ],
    };
  },
  computed: {
    loading() {
      return this.$store.state.global.loading;
    },
  },
  methods: {
    login() {
      if (!this.$refs.loginForm.validate()) return;
      this.$store.dispatch("profile/login", this.__createCredentialJson());
      this.$refs.loginForm.resetValidation();
      this.password = null;
    },
    register() {
      if (!this.$refs.loginForm.validate()) return;
      this.$store.dispatch("profile/register", this.__createCredentialJson());
      this.$refs.loginForm.resetValidation();
      this.password = null;
    },
    __createCredentialJson() {
      return { email: this.email, password: this.password };
    },
  },
};
</script>

<style>
</style>