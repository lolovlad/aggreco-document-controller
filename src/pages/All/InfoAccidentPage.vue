<template>
  <v-app v-if="isLoad">
    <DefaultHeader/>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <p class="text-h3"> Случий АО от {{ dateConvert }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <p>Объект {{accident.object.counterparty}} {{accident.object.name}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <p>Начало аварии: {{dateStartConvert}}</p>
          </v-col>
          <v-col md="6">
            <p>Конец аварии {{dateEndConvert}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8">
            <p>Поврежденное оборудованние</p>
            <v-data-table
              :headers="headersEquip"
              :items="accident.damaged_equipment"
              hide-default-footer
              v-if="accident.damaged_equipment.length !== 0"
            />
            <p v-else>Нет</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <p>Тип Повреждений</p>
            <v-data-table
                :headers="headersTypeBrake"
                :items="mehBrakeConvert"
                hide-default-footer
                v-if="accident.type_brakes.length !== 0"
            />
            <p v-else>Нет</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Причины Повреждений</p>
            <v-data-table
                :headers="headersTypeBrake"
                :items="orgBrakeConvert"
                hide-default-footer
                v-if="accident.type_brakes.length !== 0"
            />
            <p v-else>Нет</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <p>Развитие аварии</p>
            <v-timeline
                density="compact"
                side="end"
                truncate-line="end"
            >
              <v-timeline-item
                  dot-color="grey"
                  size="small"
                  v-for="item in accident.time_line"
                  :key="item.uuid"
              >
                <v-card class="elevation-2">
                  <v-card-title class="text-h5">
                    {{dateConvertTimeLine(item.time)}}
                  </v-card-title>
                  <v-card-text>{{item.description}}</v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8">
            <p>Краткая причина развития АО</p>
            <p>{{accident.causes_of_the_emergency}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8">
            <p>Затраченные материалы</p>
            <p>{{accident.damaged_equipment_material}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8">
            <p><a :href="accident.additional_material">Дополнительные материалы </a></p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DefaultHeader from "@/components/DefaultHeader.vue";
import moment from 'moment'
import axios from "axios";
export default {
  name: "InfoAccidentPage",
  components: {DefaultHeader},
  data(){
    return{
      uuidAccident: this.$route.params.uuid_accident,
      accident: null,
      isLoad: false,

      headersEquip: [
        { title: 'Название', key: 'name'},
        { title: 'Код', key: 'code'}
      ],
      headersTypeBrake: [
        { title: 'Название', key: 'name'},
        { title: 'Код', key: 'code'}
      ],
    }
  },
  methods: {
    getAccident(){
      axios
          .get(`accident/${this.uuidAccident}`)
          .then((response) => {
            this.accident = response.data
            console.log(this.accident)
            this.isLoad = true
          })
    },
    dateConvertTimeLine(date){
      let dateNew = new Date(date);
      return moment(dateNew).format('DD.MM.YYYY HH:mm');
    }
  },
  computed: {
    dateConvert(){
      let date = new Date(this.accident.datetime_start);
      return moment(date).format('DD.MM.YYYY');
    },
    dateStartConvert(){
      let date = new Date(this.accident.datetime_start);
      return moment(date).format('DD.MM.YYYY HH:mm');
    },
    dateEndConvert(){
      let date = new Date(this.accident.datetime_end);
      return moment(date).format('DD.MM.YYYY HH:mm');
    },
    orgBrakeConvert(){
      return this.accident.type_brakes
          .filter((item) => item.type.name === "org")

    },
    mehBrakeConvert(){
      return this.accident.type_brakes
          .filter((item) => item.type.name === "meh")

    }
  },
  mounted() {
    this.getAccident()
  }
}
</script>

<style scoped>

</style>