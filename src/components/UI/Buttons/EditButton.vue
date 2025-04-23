<script>
export default {
  name: "EditButton"
}
</script>

<template>
  <v-tooltip text="Редактировать" location="top">
    <template v-slot:activator="{ props }">
      <span v-bind="props" @click="this.$emit('click')">
        <v-icon
            class="me-2"
            size="small"
        >
          mdi-pencil
        </v-icon>
      </span>
    </template>
  </v-tooltip>
</template>

<style scoped>

</style>