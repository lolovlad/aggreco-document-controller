<template>
  <v-container>
    <button-back/>
    <v-tabs
        v-model="tab"
        align-tabs="center"
        color="deep-purple-accent-4"
    >
      <v-tab value="main">Главная информация</v-tab>
      <v-tab value="timeLine">Хронология событий</v-tab>
      <v-tab value="eventAccident">Мероприятия</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" class="overflow-visible">
      <v-tabs-window-item value="main">
        <v-container>
          <EditAccidentForm :uuidAccident="uuidAccident" @saveAccident="saveAccident"/>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="timeLine">
        <v-container>
          <TimeLineForm
              @addTimeLine="addTimeLine"
              @updateTimeLine="updateTimeLine"
              @deleteTimeLine="deleteTimeLine"
              :uuidAccident="uuidAccident"
              :minDate="datetimeStart"
              :maxDate="datetimeEnd"
              ref="timeLineForm"
          ></TimeLineForm>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="eventAccident">
        <v-container fluid>
          <EventForm
              :uuidAccident="uuidAccident"
              :minDate="datetimeStart"
              @updateEvent="updateEvent"
              @addEvent="addEvent"
              @deleteEvent="deleteEvent"
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

<script>
import EditAccidentForm from "@/components/Forms/EditAccidentForm";
import EventForm from "@/components/Forms/EventForm";
import axios from "axios";
import TimeLineForm from "@/components/Forms/TimeLineForm";
import AccidentService from "@/store/accident.service";
import ButtonBack from "@/components/UI/ButtonBack.vue";
export default {
  name: "EditAccidentAdminPage",
  components: {ButtonBack, TimeLineForm, EventForm, EditAccidentForm},
  data(){
    return{
      tab: null,
      uuidAccident: this.$route.params.uuid,
      datetimeStart: null,
      datetimeEnd: null,
      snackbar: false,
      message: ""
    }
  },
  methods:{
    getAccident(){
      axios
          .get(`accident/${this.uuidAccident}`)
          .then((response) => {
            const accidentResponse = response.data
            this.datetimeStart = accidentResponse.datetime_start
            this.datetimeEnd = accidentResponse.datetime_end
          })
    },

    saveAccident(accident){
      AccidentService.updateAccident(this.uuidAccident, accident)
          .then(response => {
            if(response.status >= 200){
              this.snackbar = true
              this.message = "Основная информация обновлена"
              console.log(response.status)
            }
          })
          .catch(response => {
            console.log(response.data)
          })
    },

    addTimeLine(item){
      AccidentService.addTimeLine(this.uuidAccident, item)
          .then(timeline =>{
            this.$refs.timeLineForm.timeLineSeries = timeline
            this.snackbar = true
            this.message = "Событие добавлено"
          }).catch((response) => {
        console.log(response.data)
      })
    },

    deleteTimeLine(uuidItem){
      AccidentService.deleteTimeLine(this.uuidAccident, uuidItem)
          .then((data) => {
            this.$refs.timeLineForm.timeLineSeries = data
            this.snackbar = true
            this.message = "Событие удалено"
          })
          .catch(response => {
            console.log(response.data)
          })
    },

    updateTimeLine(item){
      AccidentService.updateTimeLine(this.uuidAccident, item)
          .then((data) => {
            this.$refs.timeLineForm.timeLineSeries = data
            this.snackbar = true
            this.message = "Событие обновлено"
          })
          .catch(response => {
            console.log(response.data)
          })
    },

    addEvent(item){
      AccidentService.addEvent(this.uuidAccident, item)
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
      AccidentService.deleteEvent(this.uuidAccident, uuidEvent)
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
      AccidentService.updateEvent(this.uuidAccident, item)
          .then((data) => {
            this.$refs.eventForm.events = data
            this.snackbar = true
            this.message = "Мероприятие добавлено"
          })
          .catch(response => {
            console.log(response.data)
          })
    }

  },
  mounted() {
    this.getAccident()
  },
  watch:{
    tab(val){
      if(val === "timeLine")
        console.log(val)
    }
  }
}
</script>

<style scoped>

</style>