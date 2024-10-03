<template>
  <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      fullscreen
  >
    <template v-slot:activator="{ props: activatorProps }">
      <FixedButton
          v-bind="activatorProps"
      />
    </template>

    <v-card>
      <v-toolbar>
        <v-btn
            icon="mdi-close"
            @click="dialog = false"
        ></v-btn>

        <v-toolbar-title>Добавить АО</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn
              text="Сохранить"
              variant="text"
              @click="saveAccident"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent>
          <v-row>
            <v-col cols="12" sm="12">
              <v-select
                  label="Объект"
                  :items="listObject"
                  item-title="name"
                  item-value="uuid"
                  variant="underlined"
                  v-model="accident.object"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <VueDatePicker v-model="accident.datetime_start" locale="ru" >
                <template #input-icon>
                  <img/>
                </template>
              </VueDatePicker>
            </v-col>
            <v-col cols="12" sm="6" v-if="accident.datetime_start !== null">
              <VueDatePicker
                  v-model="accident.datetime_end"
                  locale="ru"
                  :min-date="accident.datetime_end"
                  prevent-min-max-navigation>
                <template #input-icon>
                  <img/>
                </template>
              </VueDatePicker>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <v-select
                  v-model="accident.equipments"
                  :items="listEquipment"
                  item-title="name"
                  item-value="uuid"
                  label="Оборудованние"
                  chips
                  multiple
                  variant="underlined"
                  v-if="accident.object !== null"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FixedButton from "@/components/UI/FixedButton";
import axios from "axios";
import ObjectService from "@/store/object.service";
export default {
  name: "AddAccidentForm",
  components: {FixedButton},
  data(){
    return{
      dialog: false,

      listObject: [],
      listEquipment: [],

      accident: {
        object: null,
        datetime_start: null,
        datetime_end: null,
        equipments: [],
      }
    }
  },
  methods: {
    getListObject(){
      ObjectService.getListObject().then(
          data => {
            this.listObject = data
          }
      )
    },
    getListEquipments(){
      axios
          .get(`/object/${this.accident.object}/equipment/list`)
          .then((response) => {
            this.listEquipment = response.data
          })
    },
    saveAccident(){
      this.dialog = false
      this.$emit("save", this.accident)
      this.clearForm()
    },
    clearForm(){
      const accidentShema = {
        object: null,
        datetime_start: null,
        datetime_end: null,
        equipments: [],
      }
      this.accident = accidentShema
    }
  },
  mounted() {
    this.getListObject()
  },
  watch:{
    "accident.object"(newVal){
      this.accident.object = newVal
      if(newVal !== null)
        this.getListEquipments()

    }
  }
}
</script>

<style scoped>

</style>