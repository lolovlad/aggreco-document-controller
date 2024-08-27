<template>
  <v-container>
    <v-tabs
        v-model="tab"
        align-tabs="center"
        color="deep-purple-accent-4"
    >
      <v-tab value="main">Главная информация</v-tab>
      <v-tab value="timeLine">Таймлайн</v-tab>
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

<script>
import EditAccidentForm from "@/components/Forms/EditAccidentForm";
import EventForm from "@/components/Forms/EventForm";
import axios from "axios";
import TimeLineForm from "@/components/Forms/TimeLineForm";
export default {
  name: "EditAccidentAdminPage",
  components: {TimeLineForm, EventForm, EditAccidentForm},
  data(){
    return{
      tab: null,
      uuidAccident: this.$route.params.uuid,
      datetimeStart: null,
      datetimeEnd: null
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
      axios
          .put(`accident/${this.uuidAccident}`, accident)
          .then((response) => {
            if(response.status >= 200){
              console.log(response.status)
            }
          })
          .catch((response) => {
            console.log(response.data)

          })
    },

    addTimeLine(item){
      axios
          .post(`accident/${this.uuidAccident}/time_line/`, item)
          .then((response) => {
            if(response.status >= 200){
              this.$refs.timeLineForm.timeLineSeries = response.data
              console.log(response.data)

            }
          })
          .catch((response) => {
            console.log(response.data)
          })
    },

    deleteTimeLine(uuidItem){
      axios
          .delete(`accident/${this.uuidAccident}/time_line/${uuidItem}/`)
          .then((response) => {
            if(response.status >= 200){
              this.$refs.timeLineForm.timeLineSeries = response.data
              console.log(response.data)

            }
          })
          .catch((response) => {
            console.log(response.data)
          })
    },

    updateTimeLine(item){
      axios
          .put(`accident/${this.uuidAccident}/time_line/`, item)
          .then((response) => {
            if(response.status >= 200){
              this.$refs.timeLineForm.timeLineSeries = response.data
              console.log(response.data)


            }
          })
          .catch((response) => {
            console.log(response.data)
          })
    },

    addEvent(item){
      axios
          .post(`accident/${this.uuidAccident}/event/`, item)
          .then((response) => {
            if(response.status >= 200){
              this.$refs.eventForm.events = response.data
              console.log(response.data)

            }
          })
          .catch((response) => {
            console.log(response.data)
          })
    },

    deleteEvent(uuidEvent){
      axios
          .delete(`accident/${this.uuidAccident}/event/${uuidEvent}/`)
          .then((response) => {
            if(response.status >= 200){
              this.$refs.eventForm.events = response.data
              console.log(response.data)

            }
          })
          .catch((response) => {
            console.log(response.data)
          })
    },

    updateEvent(item){
      axios
          .put(`accident/${this.uuidAccident}/event/`, item)
          .then((response) => {
            if(response.status >= 200){
              this.$refs.eventForm.events = response.data
              console.log(response.data)


            }
          })
          .catch((response) => {
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