<script>
import DefaultHeader from "@/components/DefaultHeader.vue";
import moment from "moment/moment";
import ClaimService from "@/store/claim.service";
import ButtonBack from "@/components/UI/ButtonBack.vue";

export default {
  name: "InfoClaimPage",
  components: {ButtonBack, DefaultHeader},
  data(){
    return{
      uuidClaim: this.$route.params.uuid_claim,
      claim: null,
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
      ClaimService.getClaims(this.uuidClaim).then((claim) => {
        this.claim = claim
        console.log(claim)
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
      let date = new Date(this.claim.accident.datetime_start);
      return moment(date).format('DD.MM.YYYY');
    },
    dateStartConvert(){
      let date = new Date(this.claim.accident.datetime_start);
      return moment(date).format('DD.MM.YYYY HH:mm');
    },
    dateEndConvert(){
      let date = new Date(this.claim.accident.datetime_end);
      return moment(date).format('DD.MM.YYYY HH:mm');
    },
    orgBrakeConvert(){
      return this.claim.accident.type_brakes
          .filter((item) => item.type.name !== "meh")

    },
    mehBrakeConvert(){
      return this.claim.accident.type_brakes
          .filter((item) => item.type.name === "meh")

    }
  },
  mounted() {
    this.getAccident()
  }
}
</script>

<template>
  <v-app v-if="isLoad">
    <DefaultHeader/>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <p class="text-h3">АО от {{ dateConvert }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <p>Объект {{claim.accident.object.counterparty}} {{claim.accident.object.name}}</p>
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
                :items="claim.accident.damaged_equipment"
                hide-default-footer
                v-if="claim.accident.damaged_equipment.length !== 0"
            />
            <p v-else>Нет</p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="12">
            <p>Учетные признаки аварии</p>
            <v-data-table
                :headers="headersTypeBrake"
                :items="claim.accident.signs_accident"
                hide-default-footer
                v-if="claim.accident.type_brakes.length !== 0"
            />
            <p v-else>Нет</p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <p>Технические признаки аварии</p>
            <v-data-table
                :headers="headersTypeBrake"
                :items="mehBrakeConvert"
                hide-default-footer
                v-if="claim.accident.type_brakes.length !== 0"
            />
            <p v-else>Нет</p>
          </v-col>
          <v-col cols="12" md="6">
            <p>Организационные признаки аварии</p>
            <v-data-table
                :headers="headersTypeBrake"
                :items="orgBrakeConvert"
                hide-default-footer
                v-if="claim.accident.type_brakes.length !== 0"
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
                  v-for="item in claim.accident.time_line"
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
            <p>Описательный блок</p>
            <p>{{claim.accident.causes_of_the_emergency}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8">
            <p>Потраченные материалы</p>
            <p>{{claim.accident.damaged_equipment_material}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="8">
            <p><a :href="claim.accident.additional_material">Ссылка  на дополнительную информацию</a></p>
          </v-col>
        </v-row>
      </v-container>
      <button-back/>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>