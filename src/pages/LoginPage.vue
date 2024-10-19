<template>
  <v-container>
    <v-row align="center">
      <v-col cols="12" md="12">
        <v-sheet>
          <h1 class="text-center">Aggreco-work-tool</h1>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="12">
        <v-card class="mx-auto my-8"
                elevation="16"
                max-width="700">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-alert
                      density="compact"
                      :text="error"
                      title="Ошибка входа"
                      type="warning"
                      v-if="error !== null"
                  />
                </v-col>
              </v-row>
            </v-container>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-form v-model="valid">
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-text-field
                              v-model="email"
                              :rules="emailRules"
                              label="Email"
                              variant="underlined"
                              type="email"
                              required
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-text-field
                              v-model="password"
                              label="Пароль"
                              variant="underlined"
                              type="password"
                              required
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="12">
                          <ButtonAgrea @click="login">Вход</ButtonAgrea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from "@/router/router";
import ButtonAgrea from "@/components/UI/ButtonAgrea";

export default {
  components: {ButtonAgrea},
  data(){
    return{
      email: "",
      password: "",
      error: null
    }
  },
  methods:{
    login(){
      this.$store.dispatch('auth/login', {url: '/login/sign-in', email: this.email, password: this.password})
          .then(
              (response) => {
                if (response.status !== 200){
                  this.error = response.message
                }
                else{
                  router.push('/admin')
                }
              },
          )
    }
  },
  name: "LoginPage"
}
</script>

<style scoped>
</style>