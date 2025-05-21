<template>
  <custom-admin-header/>
  <v-main>
    <router-view>

    </router-view>
    <scroll-to-top-button/>
  </v-main>
</template>

<script>
import CustomAdminHeader from "@/components/CustomAdminHeader";
import ScrollToTopButton from "@/components/UI/Buttons/ScrollToTopButton.vue";
export default {
  name: "AdminMainPage",
  components: {ScrollToTopButton, CustomAdminHeader}
}
</script>

<style scoped>

</style>