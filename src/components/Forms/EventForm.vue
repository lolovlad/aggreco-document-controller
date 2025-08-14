<template>
  <v-row>
    <v-data-table
        :headers="headers"
        :items="events"
        hide-default-footer
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            size="small"
            @click="deleteEvent(item)"
            v-if="!readOnly"
        >
          mdi-delete
        </v-icon>
        <v-icon
            class="me-2"
            size="small"
            @click="editEvent(item)"
            v-if="!readOnly"
        >
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-row>
  <v-row v-if="!readOnly">
    <v-btn @click="dialog = true">
      Добавить
    </v-btn>
  </v-row>

  <v-dialog
      v-model="dialog"
      width="1000px"
  >
    <v-card
        prepend-icon="mdi-update"
        title="Добавить"
        class="overflow-visible"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="12">
            <v-text-field label="Ответственный" variant="underlined" auto-grow v-model="event.responsible"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12">
            <v-textarea label="Описание мероприятия" variant="underlined" auto-grow v-model="event.description"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-select
                label="Тип"
                :items="listTypeEvent"
                item-title="description"
                item-value="id"
                variant="underlined"
                v-model="event.id_type_event"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <label>Дата проведения</label>
            <VueDatePicker
                v-model="event.date_finish"
                locale="ru"
                :enable-time-picker="false"
                :format="formatDate"
                :min-date="midDateTime"
                utc="preserve"
            >
              <template #input-icon>
                <img/>
              </template>
            </VueDatePicker>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
                label="Состояние"
                :items="listStateEvent"
                item-title="description"
                item-value="id"
                variant="underlined"
                v-model="event.id_state_event"
            />
          </v-col>
        </v-row>

      </v-card-text>
      <template v-slot:actions>
        <v-btn
            class="ms-auto"
            text="Добавить"
            @click="saveEvent"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>

</template>

<script>
import moment from "moment/moment";
import accidentService from "@/store/accident.service";
import EnvService from "@/store/env.service";

export default {
  name: "EventForm",
  props: {
    uuidAccident: null,
    readOnly: {
      type: Boolean,
      default: false
    },
    minDate: null,
  },
  data(){
    return{
      headers: [
        {title: 'Мероприятие', key: 'description'},
        {title: 'Ответственный', key: 'responsible'},
        {title: 'Тип', key: 'type_event', value: item => item.type_event.description},
        {title: 'Дата', key: 'date_finish', value: item => {

            const dateNow = new Date(item.date_finish)
            return moment(dateNow).format('DD.MM.YYYY HH:mm')}},
        {title: 'Состояние', key: 'state_event', value: item => item.state_event.description},
        {title: 'Управление', key: 'actions'}
      ],

      listTypeEvent: [],
      listStateEvent: [],

      events: [],
      dialog: false,

      event: {
        uuid: null,
        date_finish: null,
        description: null,
        id_state_event: 1,
        id_type_event: 1,
        responsible: ""
      },
      defaultEvent: {
        uuid: null,
        date_finish: null,
        description: null,
        id_state_event: 1,
        id_type_event: 1,
        responsible: ""
      },
    }
  },
  methods: {
    addEvent(){

    },
    getStateEvent(){
      EnvService.getStateEvent().then(
          (stateEvent) => {
            this.listStateEvent = stateEvent
          }
      )
    },
    getTypeEvent(){
      EnvService.getTypeEvent().then(
          (typeEvent) => {
            this.listTypeEvent = typeEvent
          }
      )
    },
    getAllEvents(){
      accidentService.getEventAll(this.uuidAccident).then(
          (events) => {
            this.events = events
          }
      )
    },
    getEvent(uuid){
      accidentService.getEvent(this.uuidAccident, uuid).then((evt) => {
        const targetEvent = evt
        this.event.description = targetEvent.description
        this.event.uuid = targetEvent.uuid
        this.event.date_finish = targetEvent.date_finish
        this.event.id_type_event = targetEvent.id_type_event
        this.event.id_state_event = targetEvent.id_state_event
        this.event.responsible = targetEvent.responsible
        this.dialog = true
      })
    },

    closeDialog(){
      this.dialog = false
      Object.assign(this.event, this.defaultEvent)
    },

    saveEvent(){
      if(this.event.uuid !== null){
        this.$emit("updateEvent", this.event)
      }else{
        this.$emit("addEvent", this.event)
      }
      this.$nextTick(this.closeDialog)
    },

    deleteEvent(item){
      this.$emit("deleteEvent", item.uuid)
    },

    editEvent(item){
      this.getEvent(item.uuid)
    },

    formatDate(date){
      return moment(date).format('DD/MM/YYYY');
    }

  },
  mounted() {
    this.getStateEvent()
    this.getTypeEvent()
    this.getAllEvents()
  },
  computed: {
    midDateTime(){
      const dateWithTimezone = new Date(this.minDate)

      const timezoneOffsetMinutes = dateWithTimezone.getTimezoneOffset()
      const timezoneOffsetMilliseconds = timezoneOffsetMinutes * 60 * 1000

      const adjustedTime = new Date(dateWithTimezone.getTime() + timezoneOffsetMilliseconds)
      return adjustedTime
    }
  }
}
</script>

<style scoped>

</style>