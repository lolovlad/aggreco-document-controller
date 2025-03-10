<script>
import router from "@/router/router";
import {auth as $store} from "@/store/auth.model";

export default {
  name: "YandexAcceptPage",
  data(){
    return{
      state: null,
      code: null,
      cid: null
    }
  },
  methods: {
    login(email, password){
      this.$store.dispatch('auth/login', {url: '/login/sign-in', email: email, password: password})
          .then(
              (response) => {
                if (response.status !== 200){
                  this.error = response.message
                }
                else{
                  const initialState = $store.state;
                  if(initialState.user.type.name === "user"){
                    router.push("/worker/object")
                  }else{
                    router.push('/admin/claim')
                  }
                }
              },
          )
    },
    resolveCode(){
      this.$store.dispatch('auth/login', {code: this.code, token: this.state})
            .then(
                (response) => {
                  if (response.status !== 200){
                    router.push("/")
                  }
                  else{
                    const initialState = $store.state;
                    if(initialState.user.type.name === "user"){
                      router.push("/worker/object")
                    }else{
                      router.push('/admin/claim')
                    }
                  }
                },
            )
    }
  },
  mounted() {
    const query = this.$route.query
    this.code = query.code || null
    this.state = query.state || null
    this.cid = query.cid || null
    if(this.code !== null){
      this.resolveCode()
    }
  }
}
</script>

<template>
  <v-container fluid class="fill-height d-flex justify-center align-center">
    <v-progress-circular indeterminate size="64" color="rgb( 253,110,57)"></v-progress-circular>
  </v-container>
</template>

<style scoped>
</style>