<template>
  <v-container>
    <v-row>
      <v-data-table
          :headers="headers"
          :items="timeLineSeries"
          hide-default-footer
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
              size="small"
              @click="deleteEvent(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon
              class="me-2"
              size="small"
              @click="editEvent(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-row>
  </v-container>
  <FixedButton
      @click="dialog = true"
  />
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

        <v-toolbar-title>Добавить состояние</v-toolbar-title>

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
                  :min-date="minDate"
                  :max-date="maxDate"/>
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
import FixedButton from "@/components/UI/FixedButton";
import axios from "axios";
export default {
  name: "TimeLineForm",
  props: {
    minDate: null,
    maxDate: null,
    uuidAccident: null
  },
  components: {FixedButton},
  data(){
    return{
      headers: [
        { title: 'Время', key: 'time', value: item => {
          const dateNow = new Date(item.time)
          return `${dateNow.toLocaleString()}`
          }},
        { title: 'Описание', key: 'description'},
        { title: 'Действия', key: 'actions'}
      ],
      dialog: false,
      timeLineSeries: [],

      editItem: {
        uuid: null,
        description: null,
        time: null
      },
      defaultItem: {
        uuid: null,
        description: null,
        time: null
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
      axios
          .get(`accident/${this.uuidAccident}/time_line/`)
          .then((response) => {
            this.timeLineSeries = response.data
          })
    }
  },
  mounted() {
    this.getTimeLine()
  }
}
</script>

<style scoped>

</style>