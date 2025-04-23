<script>
import EnvService from "@/store/env.service";

export default {
  name: "EditTypeEquipmentForm",
  props: {
    addMode: {
      type: Boolean,
      default: true
    },
  },
  data: () => ({
    dialog: false,
    typeEquipment: {
      id: null,
      name: null,
      code: null,
      description: null
    },
    scemaTypeEquipment: {
      id: null,
      name: null,
      code: null,
      description: null
    }
  }),
  methods: {
    saveEquip(){
      EnvService.addTypeEquipment(this.typeEquipment).then(() => {

        this.clearForm()

        this.$emit("addProf")
      }).catch((e) => {
        console.log(e)
      })
    },
    clearForm(){
      Object.assign(this.typeEquipment, this.scemaTypeEquipment)
      this.dialog = false
    }
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      max-width="600"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          class="text-none font-weight-regular"
          prepend-icon="mdi-account"
          text="Добавить"
          variant="tonal"
          v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card
        prepend-icon="mdi-account"
        title="Тип оборудованния"
    >
      <v-card-text>
        <v-row dense>
          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                label="Название"
                type="text"
                v-model="typeEquipment.name"
                required
            ></v-text-field>
          </v-col>
          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                label="код*"
                v-model="typeEquipment.code"
                type="text"
                required
            ></v-text-field>
          </v-col>

          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                label="На русском языке*"
                v-model="typeEquipment.description"
                type="text"
                required
            ></v-text-field>
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">*Поле обязательное</small>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            text="Закрыть"
            variant="plain"
            @click="clearForm"
        ></v-btn>

        <v-btn
            color="primary"
            text="Сохранить"
            variant="tonal"
            @click="saveEquip"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>