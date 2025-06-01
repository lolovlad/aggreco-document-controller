<script>
import EnvService from "@/store/env.service";

export default {
  name: "EditRegionForm",
  props: {
    addMode: {
      type: Boolean,
      default: true
    },
  },
  data: () => ({
    dialog: false,
    region: {
      id: null,
      name: null,
      code: null,
    },
    scemaRegion: {
      id: null,
      name: null,
      code: null,
    }
  }),
  methods: {
    saveRegion(){
      EnvService.addRegion(this.region).then(() => {
        this.clearForm()
        this.$emit("addRegion")
      })
    },
    clearForm(){
      Object.assign(this.region, this.scemaRegion)
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
          prepend-icon="mdi-plus"
          text="Добавить"
          variant="tonal"
          v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card
        prepend-icon="mdi-plus"
        title="Регион"
    >
      <v-card-text>
        <v-row dense>
          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                label="Название *"
                type="text"
                v-model="region.name"
                required
            ></v-text-field>
          </v-col>
          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                label="код *"
                v-model="region.code"
                type="text"
                required
            ></v-text-field>
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">* - Поле обязательное</small>
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
            @click="saveRegion"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>