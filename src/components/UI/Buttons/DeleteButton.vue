<script>
export default {
  name: "DeleteButton",
  data(){
    return {
      dialogDelete: false,
    }
  },
  methods: {
    agree(){
      this.$emit('agree')
      this.$nextTick(() => {
        this.dialogDelete = false
      })
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
      <v-tooltip text="Удалить" location="top">
        <template v-slot:activator="{ props }">
          <span v-bind="props">
            <v-icon
                class="me-2"
                size="small"
                v-bind="activatorProps"
            >
              mdi-delete
            </v-icon>
          </span>
        </template>
      </v-tooltip>
    </template>
    <v-card
        prepend-icon="mdi-close"
        text="При согласии запись будет удалена"
        title="Вы действительно хотите удалить запись?"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialogDelete = false">
          Отмена
        </v-btn>

        <v-btn @click="agree">
          Подтвердить
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>