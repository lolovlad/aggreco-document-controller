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
                       :format="formatDate"
                       utc="preserve">
          <template #input-icon>
            <img/>
          </template>
        </VueDatePicker>
      </v-col>
      <v-col cols="12" sm="6" v-if="accident.datetime_start !== null">
        <VueDatePicker
            v-model="accident.datetime_end"
            locale="ru"
            :min-date="midDateTime"
            prevent-min-max-navigation
            :readonly="readOnly"
            :format="formatDate"
            utc="preserve">
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
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-select
            v-model="accident.signs_accident"
            :items="listSignsAccident"
            label="Учетные признаки аварии"
            variant="underlined"
            item-value="id"
            item-title="name"
            multiple
            :readonly="readOnly"
        >
          <template v-slot:selection="{ item }">
            <v-tooltip location="end">
              <template #activator="{ props: tooltipProps }">
                <v-chip text-color="white" small v-bind="tooltipProps">{{ truncate(item.raw.name, 40) }}</v-chip>
              </template>
              <span class="tooltip-text">{{ item.raw.name }}</span>
            </v-tooltip>
          </template>
          <template #item="{ item, props }">
            <v-tooltip location="end">
              <template #activator="{ props: tooltipProps }">
                <div v-bind="tooltipProps">
                  <v-list-item v-bind="props">
                    <template #title>
                      <span>{{ truncate(item.raw.name, 40) }}</span>
                    </template>
                  </v-list-item>
                </div>
              </template>
              <span class="tooltip-text">{{ item.raw.name }}</span>
            </v-tooltip>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-select
            v-model="accident.class_meh_brake"
            :items="listTypeBrakesMeh"
            label="Технические признаки аварии"
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
            label="Организационные признаки аварии"
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
            label="Описательный блок"
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
import EnvService from "@/store/env.service";

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

      listSignsAccident: [],

      accident:{
        uuid: null,
        uuid_object: null,
        datetime_start: null,
        datetime_end: null,
        damaged_equipment: [],
        class_org_brake: [],
        class_meh_brake: [],
        signs_accident: [],
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
            console.log(response.data)

            const accidentResponse = response.data
            this.accident.uuid = accidentResponse.uuid
            this.accident.uuid_object = accidentResponse.object.uuid

            this.accident.datetime_start = accidentResponse.datetime_start + "Z"
            if(accidentResponse.datetime_end === null)
              this.accident.datetime_end = accidentResponse.datetime_end
            else
              this.accident.datetime_end = accidentResponse.datetime_end + "Z"

            this.accident.damaged_equipment = accidentResponse.damaged_equipment

            this.accident.class_org_brake = accidentResponse.type_brakes
                .filter((item) => item.type.name !== "meh")
                .map((item) => item.id)
            this.accident.class_meh_brake = accidentResponse.type_brakes
                .filter((item) => item.type.name === "meh")
                .map((item) => item.id)

            this.accident.causes_of_the_emergency = accidentResponse.causes_of_the_emergency
            this.accident.damaged_equipment_material = accidentResponse.damaged_equipment_material
            this.accident.additional_material = accidentResponse.additional_material
            this.accident.signs_accident = accidentResponse.signs_accident.map((item) => item.id)
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
      EnvService.getListMehTypeBrake().then(
          typeBrake => {
            this.listTypeBrakesMeh = typeBrake
          }
      )
      EnvService.getListDomesticOrganizationalTypeBrake().then(
          typeBrake => {
            this.listTypeBrakesOrg = typeBrake
          }
      )
      EnvService.getListExternalOrganizationalTypeBrake().then(
          typeBrake => {
            this.listTypeBrakesOrg = this.listTypeBrakesOrg.concat(typeBrake)
          }
      )
    },
    getSignsAccident(){
      EnvService.getListSignsAccident().then((signs) => {
        this.listSignsAccident = signs
        for(const item of this.listSignsAccident){
          item["name"] = `${item["name"]} ${item["code"]}`.trim()
        }
      })
    },
    truncate(text, length = 30) {
      if (!text) return ''
      const parts = text.split(" ")
      const allButLast = parts.slice(0, -1).join(' ');
      return allButLast.length > length ? allButLast.slice(0, length) + '...' + parts.at(-1) : text
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
        id_state_accident: this.accident.id_state_accident,
        signs_accident: this.accident.signs_accident
      })
    },
    formatDate(date){
      return moment(date).format('DD/MM/YYYY HH:mm');
    }
  },
  mounted() {
    this.getSignsAccident()
    this.getListObject()
    this.getAccident()
    this.getTypeBrakes()
  },
  computed: {
    midDateTime(){
      const dateWithTimezone = new Date(this.accident.datetime_start)

      const timezoneOffsetMinutes = dateWithTimezone.getTimezoneOffset()
      const timezoneOffsetMilliseconds = timezoneOffsetMinutes * 60 * 1000

      const adjustedTime = new Date(dateWithTimezone.getTime() + timezoneOffsetMilliseconds)
      return adjustedTime
    }
  }
}
</script>

<style scoped>
.tooltip-text {
  white-space: normal;
  max-width: 300px;
  word-wrap: break-word;
  display: block;
}
</style>