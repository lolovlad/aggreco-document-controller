<template>
  <v-container>
    <v-row>
      <v-data-table
          :headers="headers"
          :items="timeLineSeries"
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
  </v-container>
  <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      fullscreen
  >
    <v-card>
      <v-toolbar>
        <v-btn
            icon="mdi-close"
            @click="closeDialog"
        ></v-btn>

        <v-toolbar-title>Добавить событие</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn
              text="Сохранить"
              variant="text"
              @click="saveEvent"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent>
          <v-row>
            <v-col cols="12" sm="12">
              <VueDatePicker
                  v-model="editItem.time"
                  enable-seconds
                  locale="ru"
                  :min-date="minDataNow"
                  :max-date="maxDataNow"
                  :format="formatDate"
                  utc="preserve"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <v-textarea v-model="editItem.description"
                          label="Описание"
                          variant="underlined"
                          auto-grow/>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script>
import moment from "moment";
import AccidentService from "@/store/accident.service";
export default {
  name: "TimeLineForm",
  props: {
    minDate: null,
    maxDate: null,
    uuidAccident: null,
    readOnly:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      headers: [
        { title: 'Время', key: 'time', value: item => {
            const dateNow = new Date(item.time)
            return moment(dateNow).format('DD.MM.YYYY HH:mm')
        }},
        { title: 'Описание', key: 'description'},
        { title: 'Действия', key: 'actions'}
      ],
      dialog: false,
      timeLineSeries: [],

      editItem: {
        uuid: null,
        description: null,
        time: this.minDate + "Z"
      },
      defaultItem: {
        uuid: null,
        description: null,
        time: this.minDate + "Z"
      },

      uuidItem: null
    }
  },
  methods: {
    deleteEvent(item){
      this.$emit("deleteTimeLine", item.uuid)
    },

    editEvent(item){
      this.dialog = true
      this.uuidItem = item.uuid

      this.editItem.uuid = item.uuid
      this.editItem.description = item.description
      this.editItem.time = item.time
    },

    closeDialog(){
      this.dialog = false
      this.uuidItem = null
      Object.assign(this.editItem, this.defaultItem)
    },

    saveEvent(){
      if(this.uuidItem !== null){
        this.$emit("updateTimeLine", this.editItem)
      }else{
        this.$emit("addTimeLine", this.editItem)
      }
      this.$nextTick(this.closeDialog)
    },

    getTimeLine(){
      AccidentService.getTimeLine(this.uuidAccident).then((timeline) => {
        this.updateTimeLineTable(timeline)
      }).catch((error) => {
        console.log(error)
      })
    },
    updateTimeLineTable(timeLineSeries){
      this.timeLineSeries = timeLineSeries
      if(timeLineSeries.length > 0){
        this.editItem.time = timeLineSeries[timeLineSeries.length - 1].time
        this.defaultItem.time = timeLineSeries[timeLineSeries.length - 1].time
      }else{
        this.editItem.time = this.minDate + "Z"
        this.defaultItem.time = this.minDate + "Z"
      }
    },

    formatDate(date){
      return moment(date).format('DD/MM/YYYY HH:mm');
    }
  },

  computed: {
    minDataNow(){
      const currentDate = new Date(this.minDate);
      const tenDaysAgo = new Date(this.minDate)
      tenDaysAgo.setDate(currentDate.getDate() - 10);
      return tenDaysAgo
    },
    maxDataNow(){
      const currentDate = new Date(this.maxDate);
      const tenDaysAgo = new Date(this.maxDate)
      tenDaysAgo.setDate(currentDate.getDate() + 10);
      return tenDaysAgo
    }
  },

  mounted() {
    this.getTimeLine()
  }
}
</script>

<style scoped>

</style>