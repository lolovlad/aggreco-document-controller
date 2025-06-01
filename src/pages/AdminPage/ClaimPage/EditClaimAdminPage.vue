<script>
import TimeLineForm from "@/components/Forms/TimeLineForm.vue";
import EditClaimFrom from "@/components/Forms/EditClaimFrom.vue";
import EventForm from "@/components/Forms/EventForm.vue";
import EditAccidentForm from "@/components/Forms/EditAccidentForm.vue";
import {auth as $store} from "@/store/auth.model";
import ClaimService from "@/store/claim.service";
import AccidentService from "@/store/accident.service";
import ButtonBack from "@/components/UI/ButtonBack.vue";

export default {
  name: "EditClaimAdminPage",
  components: {ButtonBack, EditAccidentForm, EventForm, EditClaimFrom, TimeLineForm},
  data(){
    return{
      tab: null,
      uuidClaim: this.$route.params.uuid,
      datetimeStart: null,
      datetimeEnd: null,
      claim: null,
      load: false,
      isUser: $store.state.user.type.name === "user",
    }
  },
  methods: {
    getClaim(){
      ClaimService.getClaims(this.uuidClaim).then(claim => {
        this.claim = claim
        this.datetimeStart = claim.accident.datetime_start
        this.datetimeEnd = claim.accident.datetime_end
        this.load = true
      })

    },

    saveAccident(accident){
      AccidentService.updateAccident(this.claim.accident.uuid, accident).then(() =>{
      })
    },

    addTimeLine(item){
      AccidentService.addTimeLine(this.claim.accident.uuid, item)
          .then(timeline =>{
            this.$refs.timeLineForm.timeLineSeries = timeline
          })
    },

    deleteTimeLine(uuidItem){
      AccidentService.deleteTimeLine(this.claim.accident.uuid, uuidItem)
          .then((data) => {
            this.$refs.timeLineForm.timeLineSeries = data
          })
    },

    updateTimeLine(item){
      AccidentService.updateTimeLine(this.claim.accident.uuid, item)
          .then((data) => {
            this.$refs.timeLineForm.timeLineSeries = data
          })
    },

    addEvent(item){
      AccidentService.addEvent(this.claim.accident.uuid, item)
          .then((data) => {
            this.$refs.eventForm.events = data
          })
    },

    deleteEvent(uuidEvent){
      AccidentService.deleteEvent(this.claim.accident.uuid, uuidEvent)
          .then((data) => {
            this.$refs.eventForm.events = data
          })

    },

    updateEvent(item){
      AccidentService.updateEvent(this.claim.accident.uuid, item)
          .then((data) => {
            this.$refs.eventForm.events = data
          })
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
      <v-tab value="claim">Информация заявки</v-tab>
      <v-tab value="accident">Информация инцидента</v-tab>
      <v-tab value="timeLine">Хронология событий</v-tab>
      <v-tab value="eventAccident">Мероприятия</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" class="overflow-visible">
      <v-tabs-window-item value="claim">
        <v-container>
          <EditClaimFrom :uuidClaim="claim.uuid" :is-user="isUser"/>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="accident">
        <v-container>
          <EditAccidentForm :uuidAccident="claim.accident.uuid" @saveAccident="saveAccident"/>
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
              ref="eventForm"
          />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>

</template>

<style scoped>

</style>