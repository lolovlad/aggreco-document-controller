<script>
export default {
  name: "SendBackButton",
  props:{
    typeUser:{
      type:String
    }
  }
}
</script>

<template>
  <v-tooltip location="top">
    <template #activator="{ props: tooltipProps }">
      <v-icon @click="this.$emit('click')" class="me-2" size="small" v-bind="tooltipProps">mdi-arrow-down-thin</v-icon>
    </template>
    <span v-if="typeUser === 'user'">Отозвать (первые 24 часа)</span>
    <span v-else>Отправить на доработку</span>
  </v-tooltip>
</template>

<style scoped>

</style>