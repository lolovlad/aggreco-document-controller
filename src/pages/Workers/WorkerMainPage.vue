<script>
import WorkerHeader from "@/components/WorkerHeader.vue";
import ScrollToTopButton from "@/components/UI/Buttons/ScrollToTopButton.vue";

export default {
  name: "WorkerMainPage",
  components: {ScrollToTopButton, WorkerHeader}
}
</script>

<template>
  <worker-header/>
  <v-main>
    <router-view>

    </router-view>
    <scroll-to-top-button/>
  </v-main>
</template>

<style scoped>

</style>