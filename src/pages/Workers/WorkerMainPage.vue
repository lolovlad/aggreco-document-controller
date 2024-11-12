<script>
import WorkerHeader from "@/components/WorkerHeader.vue";

export default {
  name: "WorkerMainPage",
  components: {WorkerHeader}
}
</script>

<template>
  <worker-header/>
  <v-main>
    <router-view>

    </router-view>
  </v-main>
</template>

<style scoped>

</style>