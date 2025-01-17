<script>
export default {
  name: "DeleteButton",
  data(){
    return {
      dialogDelete: false,

    }
  }
}
</script>

<template>
  <v-dialog
      v-model="dialogDelete"
      max-width="500"
      persistent
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-icon
          class="me-2"
          size="small"
          v-bind="activatorProps"
      >
        mdi-delete
      </v-icon>
    </template>
    <v-card
        prepend-icon="mdi-close"
        text="При согласиии запись будет удалена"
        title="Вы действиетльно хотите удалить запись?"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialogDelete = false">
          Отмена
        </v-btn>

        <v-btn @click="$emit('agree')">
          Подтвердить
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>