<script>
export default {
  name: "SendForwardButton",
  props: {
    typeUser:{
      type:String
    }
  }
}
</script>

<template>
  <v-tooltip location="top">
    <template #activator="{ props: tooltipProps }">
      <v-icon class="me-2" size="small" v-bind="tooltipProps" @click="this.$emit('click')">mdi-arrow-up-thin</v-icon>
    </template>
    <span v-if="typeUser === 'user'">Отправить на проверку</span>
    <span v-else>Одобрить</span>
  </v-tooltip>

</template>

<style scoped>

</style>