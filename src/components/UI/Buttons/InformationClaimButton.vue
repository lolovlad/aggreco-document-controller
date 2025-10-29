<script>
import moment from "moment/moment";
import ClaimService from "@/store/claim.service";
import axios from "axios";

export default {
  name: "InformationClaimButton",
  props: {
    uuidClaim: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      claim: null,
      isLoad: false,
      mainFileClaimRef: null,
      editFileClaimRef: null,
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
    openModal() {
      this.showModal = true;
      this.getClaim();
    },
    closeModal() {
      this.showModal = false;
      this.$nextTick(() => {
        this.isLoad = false;
        this.claim = null;
      })
    },
    getClaim() {
      ClaimService.getClaims(this.uuidClaim).then((claim) => {
        if (claim.accident.time_line && Array.isArray(claim.accident.time_line)) {
          claim.accident.time_line.sort((a, b) => new Date(a.time) - new Date(b.time))
        }
        this.claim = claim
        if(claim.main_document && typeof claim.main_document === 'string' && claim.main_document.includes('/')){
          this.mainFileClaimRef = `${axios.defaults.baseURL}claim/file/main/${claim.uuid}`
        } else {
          this.mainFileClaimRef = null
        }
        if(claim.edit_document && typeof claim.edit_document === 'string' && claim.edit_document.includes('/')){
          this.editFileClaimRef = `${axios.defaults.baseURL}claim/file/edit/${claim.uuid}`
        } else {
          this.editFileClaimRef = null
        }
        this.isLoad = true
      })
    },
    dateConvertTimeLine(date) {
      let dateNew = new Date(date);
      return moment(dateNew).format('DD.MM.YYYY HH:mm');
    }
  },
  computed: {
    dateConvert() {
      if (!this.claim) return '';
      let date = new Date(this.claim.accident.datetime_start);
      return moment(date).format('DD.MM.YYYY');
    },
    dateStartConvert() {
      if (!this.claim) return '';
      let date = new Date(this.claim.accident.datetime_start);
      return moment(date).format('DD.MM.YYYY HH:mm');
    },
    dateEndConvert() {
      if (!this.claim) return '';
      let date = new Date(this.claim.accident.datetime_end);
      return moment(date).format('DD.MM.YYYY HH:mm');
    },
    orgBrakeConvert() {
      if (!this.claim) return [];
      return this.claim.accident.type_brakes
          .filter((item) => item.type.name !== "meh")
    },
    mehBrakeConvert() {
      if (!this.claim) return [];
      return this.claim.accident.type_brakes
          .filter((item) => item.type.name === "meh")
    }
  }
}
</script>

<template>
    <!-- Модальное окно -->
    <v-dialog v-model="showModal" max-width="1200px" persistent>
      <template v-slot:activator="">
        <v-tooltip text="Информация о заявке" location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" @click="openModal">
              <v-icon
                  class="me-2"
                  size="small"
              >
                mdi-information
              </v-icon>
            </span>
          </template>
        </v-tooltip>
      </template>


      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Информация о заявке</span>
        </v-card-title>
        
        <v-card-text v-if="isLoad && claim">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="12">
                <p class="text-h5">АО от {{ dateConvert }}</p>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <p>
                  <a v-if="mainFileClaimRef" :href="mainFileClaimRef" target="_blank">Скачать главный файл</a>
                  <span v-else>Главный файл не загружен</span>
                </p>
              </v-col>
              <v-col cols="12" md="6">
                <p>
                  <a v-if="editFileClaimRef" :href="editFileClaimRef" target="_blank">Скачать файл с правками</a>
                  <span v-else>Файл с правками не загружен</span>
                </p>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="12">
                <p><strong>Объект:</strong> {{claim.accident.object.counterparty}} {{claim.accident.object.name}}</p>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <p><strong>Начало аварии:</strong> {{dateStartConvert}}</p>
              </v-col>
              <v-col md="6">
                <p><strong>Конец аварии:</strong> {{dateEndConvert}}</p>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="8">
                <p class="text-subtitle-1"><strong>Поврежденное оборудование</strong></p>
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
                <p class="text-subtitle-1"><strong>Учетные признаки аварии</strong></p>
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
                <p class="text-subtitle-1"><strong>Технические признаки аварии</strong></p>
                <v-data-table
                    :headers="headersTypeBrake"
                    :items="mehBrakeConvert"
                    hide-default-footer
                    v-if="claim.accident.type_brakes.length !== 0"
                />
                <p v-else>Нет</p>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-subtitle-1"><strong>Организационные признаки аварии</strong></p>
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
                <p class="text-subtitle-1"><strong>Развитие аварии</strong></p>
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
                      <v-card-title class="text-h6">
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
                <p class="text-subtitle-1"><strong>Описательный блок</strong></p>
                <p>{{claim.accident.causes_of_the_emergency}}</p>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="8">
                <p class="text-subtitle-1"><strong>Потраченные материалы</strong></p>
                <p>{{claim.accident.damaged_equipment_material}}</p>
              </v-col>
            </v-row>
            
            <v-row v-if="claim.accident.additional_material">
              <v-col cols="12" md="8">
                <p class="text-subtitle-1"><strong>Дополнительная информация</strong></p>
                <p><a :href="claim.accident.additional_material" target="_blank">Ссылка на дополнительную информацию</a></p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        
        <v-card-text v-else-if="!isLoad">
          <v-progress-circular indeterminate></v-progress-circular>
          <span class="ml-3">Загрузка информации...</span>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeModal">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<style scoped>

</style>
