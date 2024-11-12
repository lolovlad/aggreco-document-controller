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
            <VueDatePicker v-model="event.date_finish" locale="ru" :enable-time-picker="false">
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
import axios from "axios";

export default {
  name: "EventForm",
  props: {
    uuidAccident: null,
    readOnly: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return{
      headers: [
        {title: 'Мероприятие', key: 'description'},
        {title: 'Тип', key: 'type_event', value: item => item.type_event.description},
        {title: 'Дата', key: 'date_finish', value: item => {
            const dateNow = new Date(item.date_finish)
            return `${dateNow.toLocaleString()}`}},
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
        id_type_event: 1
      },
      defaultEvent: {
        uuid: null,
        date_finish: null,
        description: null,
        id_state_event: 1,
        id_type_event: 1
      },
    }
  },
  methods: {
    addEvent(){

    },
    getStateEvent(){
      axios
          .get(`accident/event/state_event/`)
          .then((response) => {
            this.listStateEvent = response.data
          })
    },
    getTypeEvent(){
      axios
          .get(`accident/event/type_event/`)
          .then((response) => {
            this.listTypeEvent = response.data
          })
    },
    getAllEvents(){
      axios
          .get(`accident/${this.uuidAccident}/event/`)
          .then((response) => {
            this.events = response.data
          })
    },
    getEvent(uuid){
      axios
          .get(`accident/${this.uuidAccident}/event/${uuid}`)
          .then((response) => {
            const targetEvent = response.data
            this.event.description = targetEvent.description
            this.event.uuid = targetEvent.uuid
            this.event.date_finish = targetEvent.date_finish
            this.event.id_type_event = targetEvent.id_type_event
            this.event.id_state_event = targetEvent.id_state_event

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

  },
  mounted() {
    this.getStateEvent()
    this.getTypeEvent()
    this.getAllEvents()
  }
}
</script>

<style scoped>

</style>