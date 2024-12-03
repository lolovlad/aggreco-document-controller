<template>
  <v-form @submit.prevent>
    <v-row>
      <v-col cols="12" sm="12">
        <v-select
            label="Объект"
            :items="listObject"
            item-title="name"
            item-value="uuid"
            variant="underlined"
            v-model="accident.uuid_object"
            :readonly="readOnly"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <VueDatePicker v-model="accident.datetime_start"
                       locale="ru"
                       :readonly="readOnly"
                       :format="formatDate">
          <template #input-icon>
            <img/>
          </template>
        </VueDatePicker>
      </v-col>
      <v-col cols="12" sm="6" v-if="accident.datetime_start !== null">
        <VueDatePicker
            v-model="accident.datetime_end"
            locale="ru"
            :min-date="accident.datetime_start"
            prevent-min-max-navigation
            :readonly="readOnly"
            :format="formatDate">
          <template #input-icon>
            <img/>
          </template>
        </VueDatePicker>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <item-object-selection
            v-model="accident.damaged_equipment"
            v-if="accident.uuid_object !== null"
            :uuid-object="accident.uuid_object"
            :readonly="readOnly"
        />
        <!--<v-select
            v-model="accident.damaged_equipment"
            :items="listEquipment"
            item-title="name"
            item-value="uuid"
            label="Оборудованние"
            chips
            multiple
            variant="underlined"
            v-if="accident.uuid_object !== null"
            :readonly="readOnly"
        />-->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-select
            v-model="accident.class_meh_brake"
            :items="listTypeBrakesMeh"
            label="Класс повреждений"
            variant="underlined"
            item-title="name"
            item-value="id"
            chips
            multiple
            :readonly="readOnly"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
            v-model="accident.class_org_brake"
            :items="listTypeBrakesOrg"
            label="Причины повреждений"
            variant="underlined"
            item-title="name"
            item-value="id"
            multiple
            chips
            :readonly="readOnly"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-textarea
            label="краткий пересказ ситуации"
            variant="underlined"
            auto-grow
            v-model="accident.causes_of_the_emergency"
            :readonly="readOnly"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-textarea
            v-model="accident.damaged_equipment_material"
            label="Потраченные материалы"
            variant="underlined"
            auto-grow
            :readonly="readOnly"/>
      </v-col>
    </v-row>
    <v-row>

      <v-col cols="12" sm="5">
        <v-text-field v-model="accident.additional_material" variant="underlined" label="Ссылка на дополнительную информацию" :readonly="readOnly"/>
      </v-col>

    </v-row>
    <v-btn class="mt-4" type="submit" @click="saveChange" v-if="!readOnly">Сохранить</v-btn>
  </v-form>
</template>

<script>
import axios from "axios";
import ItemObjectSelection from "@/components/UI/ItemObjectSelection.vue";
import moment from "moment/moment";

export default {
  name: "EditAccidentForm",
  components: {ItemObjectSelection},
  props: {
    uuidAccident: null,
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return{

      listObject: [],
      listEquipment: [],

      listTypeBrakesOrg: [],
      listTypeBrakesMeh: [],

      accident:{
        uuid: null,
        uuid_object: null,
        datetime_start: null,
        datetime_end: null,
        damaged_equipment: [],
        class_org_brake: [],
        class_meh_brake: [],
        causes_of_the_emergency: null,
        damaged_equipment_material: null,
        additional_material: null,
        id_state_accident: 1
      },
    }
  },
  methods:{
    getAccident(){
      axios
          .get(`accident/${this.uuidAccident}`)
          .then((response) => {
            const accidentResponse = response.data
            this.accident.uuid = accidentResponse.uuid
            this.accident.uuid_object = accidentResponse.object.uuid

            this.accident.datetime_start = accidentResponse.datetime_start
            this.accident.datetime_end = accidentResponse.datetime_end

            this.accident.damaged_equipment = accidentResponse.damaged_equipment

            this.accident.class_org_brake = accidentResponse.type_brakes
                .filter((item) => item.type.name === "org")
                .map((item) => item.id)
            this.accident.class_meh_brake = accidentResponse.type_brakes
                .filter((item) => item.type.name === "meh")
                .map((item) => item.id)

            this.accident.causes_of_the_emergency = accidentResponse.causes_of_the_emergency
            this.accident.damaged_equipment_material = accidentResponse.damaged_equipment_material
            this.accident.additional_material = accidentResponse.additional_material
          })
    },
    getListObject(){
      axios
          .get(`/object/list`)
          .then((response) => {
            this.listObject = response.data
          })
    },
    getTypeBrakes(){
      axios
          .get(`/accident/type_brake_mechanical/org`)
          .then((response) => {
            this.listTypeBrakesOrg = response.data
          })
      axios
          .get(`/accident/type_brake_mechanical/meh`)
          .then((response) => {
            this.listTypeBrakesMeh = response.data
          })
    },
    saveChange(){
      this.$emit("saveAccident", {
        uuid_object: this.accident.uuid_object,
        datetime_start: this.accident.datetime_start,
        datetime_end: this.accident.datetime_end,
        equipments: Object.keys(this.accident.damaged_equipment),
        type_brakes: this.accident.class_meh_brake.concat(this.accident.class_org_brake),
        causes_of_the_emergency: this.accident.causes_of_the_emergency,
        damaged_equipment_material: this.accident.damaged_equipment_material,
        additional_material: this.accident.additional_material,
        id_state_accident: this.accident.id_state_accident
      })
    },
    formatDate(date){
      return moment(date).format('DD/MM/YYYY HH:mm');
    }
  },
  mounted() {
    this.getListObject()
    this.getAccident()
    this.getTypeBrakes()
  }
}
</script>

<style scoped>

</style>