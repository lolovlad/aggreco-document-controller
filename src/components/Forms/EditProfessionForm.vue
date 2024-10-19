<script>
import UserService from "@/store/user.service";

export default {
  name: "EditProfessionForm",
  props: {
    addMode: {
      type: Boolean,
      default: true
    },
  },
  data: () => ({
    dialog: false,
    prof: {
      id: null,
      name: null,
      description: null
    }
  }),
  methods: {
    saveProf(){
      UserService.addProf(this.prof).then(response => {
        console.log(response)

        this.prof.id = null
        this.prof.name = null
        this.prof.description = null

        this.dialog = false

        this.$emit("addProf")
      }).catch((e) => {
        console.log(e)
      })
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
        title="Должность"
    >
      <v-card-text>
        <v-row dense>
          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                label="Системное название на ENG*"
                type="text"
                v-model="prof.name"
                required
            ></v-text-field>
          </v-col>


          <v-col
              cols="12"
              md="12"
          >
            <v-text-field
                label="На русском языке*"
                v-model="prof.description"
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
            @click="dialog = false"
        ></v-btn>

        <v-btn
            color="primary"
            text="Сохранить"
            variant="tonal"
            @click="saveProf"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>