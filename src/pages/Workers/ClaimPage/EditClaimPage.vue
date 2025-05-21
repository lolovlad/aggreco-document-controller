<script>
import TimeLineForm from "@/components/Forms/TimeLineForm.vue";
import EventForm from "@/components/Forms/EventForm.vue";
import EditAccidentForm from "@/components/Forms/EditAccidentForm.vue";
import ClaimService from "@/store/claim.service";
import AccidentService from "@/store/accident.service";
import EditClaimFrom from "@/components/Forms/EditClaimFrom.vue";
import {auth as $store} from "@/store/auth.model";
import ButtonBack from "@/components/UI/ButtonBack.vue";

export default {
  name: "EditClaimPage",
  components: {ButtonBack, EditClaimFrom, EditAccidentForm, EventForm, TimeLineForm},
  data(){
    return{
      tab: null,
      uuidClaim: this.$route.params.uuid,
      datetimeStart: null,
      datetimeEnd: null,
      claim: null,
      load: false,
      isUser: $store.state.user.type.name === "user",
      snackbar: false,
      message: "",

      isReadOnly: false
    }
  },
  methods: {
    getClaim(){
      ClaimService.getClaims(this.uuidClaim).then(claim => {
        this.claim = claim
        this.datetimeStart = claim.accident.datetime_start
        this.datetimeEnd = claim.accident.datetime_end
        this.load = true

        this.infoReadOnly()
      })

    },

    saveAccident(accident){
      AccidentService.updateAccident(this.claim.accident.uuid, accident).then(response =>{
        this.snackbar = true
        this.message = "Основная информация обновлена"
        console.log(response)
      }).catch(response => {
        console.log(response)
      })
    },

    addTimeLine(item){
      AccidentService.addTimeLine(this.claim.accident.uuid, item)
          .then(timeline =>{
            this.$refs.timeLineForm.updateTimeLineTable(timeline)
            this.snackbar = true
            this.message = "Событие добавлено"
          }).catch((response) => {
                  console.log(response.data)
          })
    },

    deleteTimeLine(uuidItem){
      AccidentService.deleteTimeLine(this.claim.accident.uuid, uuidItem)
          .then((data) => {
            this.$refs.timeLineForm.updateTimeLineTable(data)
            this.snackbar = true
            this.message = "Событие удалено"
          })
          .catch(response => {
            console.log(response.data)
          })
    },

    updateTimeLine(item){
      AccidentService.updateTimeLine(this.claim.accident.uuid, item)
          .then((data) => {
            this.$refs.timeLineForm.updateTimeLineTable(data)
            this.snackbar = true
            this.message = "Событие обновлено"
          })
          .catch(response => {
            console.log(response.data)
          })
    },

    addEvent(item){
      AccidentService.addEvent(this.claim.accident.uuid, item)
          .then((data) => {
            this.$refs.eventForm.events = data
            this.snackbar = true
            this.message = "Мероприятие добавлено"
          })
          .catch(response => {
            console.log(response.data)
          })
    },

    deleteEvent(uuidEvent){
      AccidentService.deleteEvent(this.claim.accident.uuid, uuidEvent)
          .then((data) => {
            this.$refs.eventForm.events = data
            this.snackbar = true
            this.message = "Мероприятие добавлено"
          })
          .catch(response => {
            console.log(response.data)
          })
    },

    updateEvent(item){
      AccidentService.updateEvent(this.claim.accident.uuid, item)
          .then((data) => {
            this.$refs.eventForm.events = data
            this.snackbar = true
            this.message = "Мероприятие добавлено"
          })
          .catch(response => {
            console.log(response.data)
          })
    },
    infoReadOnly(){
      if(this.isUser){
        if(this.claim.state_claim.name === "under_consideration" || this.claim.state_claim.name === "accepted"){
          this.isReadOnly = true
        }
      }
    }
  },
  mounted() {
    this.getClaim()

  }
}
</script>

<template>
  <v-container v-if="load === false">

  </v-container>
  <v-container v-else>
    <button-back/>
    <v-tabs
        v-model="tab"
        align-tabs="center"
        color="deep-purple-accent-4"
    >
      <v-tab value="claim">Информация о регистрации</v-tab>
      <v-tab value="accident">Информация инцидента</v-tab>
      <v-tab value="timeLine">Хронология событий</v-tab>
      <v-tab value="eventAccident">Мероприятия</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" class="overflow-visible">
      <v-tabs-window-item value="claim">
        <v-container>
          <EditClaimFrom :uuidClaim="claim.uuid" :is-user="isUser" :read-only="isReadOnly"/>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="accident">
        <v-container>
          <EditAccidentForm :uuidAccident="claim.accident.uuid" @saveAccident="saveAccident" :read-only="isReadOnly"/>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="timeLine">
        <v-container>
          <TimeLineForm
              @addTimeLine="addTimeLine"
              @updateTimeLine="updateTimeLine"
              @deleteTimeLine="deleteTimeLine"
              :uuidAccident="claim.accident.uuid"
              :minDate="datetimeStart"
              :maxDate="datetimeEnd"
              :read-only="isReadOnly"
              ref="timeLineForm"
          ></TimeLineForm>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="eventAccident">
        <v-container fluid>
          <EventForm
              :uuidAccident="claim.accident.uuid"
              @updateEvent="updateEvent"
              @addEvent="addEvent"
              @deleteEvent="deleteEvent"
              :read-only="isReadOnly"
              ref="eventForm"
          />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>

  <v-snackbar
      :timeout="4000"
      v-model="snackbar"
  >
    {{message}}
  </v-snackbar>
</template>

<style scoped>

</style>