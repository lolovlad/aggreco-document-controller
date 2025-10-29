<script>
import ProposalsService from "@/store/proposals.service";
import moment from "moment/moment";

export default {
  name: "InformationProposalButton",
  props: {
    uuidProposal: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      proposal: null,
      isLoad: false
    }
  },
  computed: {
    statusColor(){
      const state = this.proposal?.state_claim
      const title = state?.title || state?.name || ''
      if (title === 'На рассмотрении') return 'orange'
      if (title === 'На доработку' || title === 'under_development') return 'red'
      return 'green'
    },
    statusText(){
      const state = this.proposal?.state_claim
      const title = state?.title || state?.name || ''
      if (title === 'На рассмотрении') return 'На рассмотрении'
      if (title === 'На доработку' || title === 'under_development') return 'Отклонено'
      return 'Принято'
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
      this.loadProposal();
    },
    closeModal() {
      this.showModal = false;
      this.$nextTick(() => {
        this.isLoad = false;
        this.proposal = null;
      })
    },
    loadProposal() {
      ProposalsService.getEntity(this.uuidProposal).then((data) => {
        this.proposal = data;
        this.isLoad = true;
      })
    },
    formatDate(date) {
      if (!date) return "-";
      return moment(new Date(date)).format('DD.MM.YYYY HH:mm');
    }
  }
}
</script>

<template>
  <v-dialog v-model="showModal" max-width="900px" persistent>
    <template v-slot:activator="">
      <v-tooltip text="Информация о предложении" location="top">
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
        <span>Информация о предложении</span>
      </v-card-title>

      <v-card-text v-if="isLoad && proposal">
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="12">
              <p class="text-h6"><strong>Название:</strong> {{ proposal.name }}</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <p class="text-subtitle-1"><strong>Предложение</strong></p>
              <p style="white-space: pre-wrap">{{ proposal.offer || '-' }}</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12" v-if="proposal.additional_material">
              <p class="text-subtitle-1"><strong>Дополнительные материалы</strong></p>
              <p><a :href="proposal.additional_material" target="_blank">Ссылка на материал</a></p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12" v-if="proposal.comment">
              <p class="text-subtitle-1"><strong>Комментарий</strong></p>
              <p style="white-space: pre-wrap">{{ proposal.comment }}</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <p><strong>Объект:</strong> {{ proposal.object?.name || '-' }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <p><strong>Статус:</strong>
                <v-chip :color="statusColor" size="small" text-color="white">
                  {{ statusText }}
                </v-chip>
              </p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <p><strong>Работник:</strong>
                <span v-if="proposal.user">{{ proposal.user.surname }} {{ proposal.user.name?.[0] }}. {{ proposal.user.patronymic?.[0] }}.</span>
                <span v-else>-</span>
              </p>
            </v-col>
            <v-col cols="12" md="6">
              <p><strong>Инженер:</strong>
                <span v-if="proposal.expert">{{ proposal.expert.surname }} {{ proposal.expert.name?.[0] }}. {{ proposal.expert.patronymic?.[0] }}.</span>
                <span v-else>-</span>
              </p>
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


