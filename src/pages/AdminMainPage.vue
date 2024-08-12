<template>
  <custom-admin-header/>
  <v-main>
    <router-view>

    </router-view>
  </v-main>
</template>

<script>
import CustomAdminHeader from "@/components/CustomAdminHeader";
export default {
  name: "AdminMainPage",
  components: {CustomAdminHeader}
}
</script>

<style scoped>

</style>