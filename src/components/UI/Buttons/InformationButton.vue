<script>
export default {
  name: "InformationButton"
}
</script>

<template>
  <v-tooltip text="Подробнее" location="top">
    <template v-slot:activator="{ props }">
      <span v-bind="props" @click="this.$emit('click')">
        <v-icon
            class="me-2"
            size="small"
        >
           mdi-information
        </v-icon>
      </span>
    </template>
  </v-tooltip>
</template>

<style scoped>

</style>